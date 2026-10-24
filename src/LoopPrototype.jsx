import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./loop-prototype.css";

// The Loop screens live in /public/loop as plain HTML pages that link to each
// other, converted from the design canvas. Light screens are N*, V* (phone)
// and W* (desktop); their dark twins carry a leading D (DN*, DV*, DW*).
const base = "/loop/";

const devices = {
  phone: {
    label: "Phone",
    width: 390,
    height: 844,
    home: "VToday",
    flows: [
      ["First launch", "NSignIn"],
      ["Today", "VToday"],
      ["Morning check-in", "VCheckInNotification"],
      ["Quick add", "VQuickAdd"],
      ["Sort the Inbox", "NSortNotif"],
      ["Notes", "NNotes"],
      ["Calendar", "NCalWeek"],
      ["Widgets", "VWidgets"],
      ["Settings", "NSettings2"],
    ],
  },
  desktop: {
    label: "Desktop",
    width: 1440,
    height: 900,
    home: "WToday",
    flows: [
      ["Welcome", "WWelcome"],
      ["Today", "WToday"],
      ["Inbox", "WInbox"],
      ["Notes", "WNotes"],
      ["Calendar", "WCalWeek"],
      ["Shortcuts", "WShortcuts"],
      ["Settings", "WSettings"],
    ],
  },
};

const isDark = (name) => /^D(N|V|W)/.test(name);
const toLight = (name) => (isDark(name) ? name.slice(1) : name);
const toTheme = (name, theme, screens) => {
  const light = toLight(name);
  if (theme === "light") return light;
  const dark = `D${light}`;
  return screens && !screens[dark] ? light : dark;
};

const screenName = (frame) => {
  try {
    const match = frame.contentWindow.location.pathname.match(/\/loop\/([^/]+)\.html$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};

function Segmented({ label, value, options, onChange }) {
  return (
    <div className="lp-seg" role="group" aria-label={label}>
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          className={value === id ? "is-on" : undefined}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function LoopPrototype() {
  const [device, setDevice] = useState("phone");
  const [theme, setTheme] = useState("light");
  const [screens, setScreens] = useState(null);
  const [current, setCurrent] = useState({ name: devices.phone.home, title: "Today" });
  const [stageWidth, setStageWidth] = useState(0);
  // The iframe's src is only set when it mounts (per device); later jumps
  // navigate inside it so a theme switch can keep the visitor's place.
  const [frameSrc, setFrameSrc] = useState(`${base}${devices.phone.home}.html`);
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const trailRef = useRef([]);
  const goingBackRef = useRef(false);

  const spec = devices[device];
  const startScreen = toTheme(spec.home, theme, screens);

  useEffect(() => {
    let cancelled = false;
    fetch(`${base}screens.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setScreens(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => setStageWidth(stage.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Replace keeps the visitor's browser history clean for our own jumps.
  const open = (name) => {
    const frame = frameRef.current;
    const url = `${base}${name}.html`;
    try {
      frame.contentWindow.location.replace(url);
    } catch {
      frame.src = url;
    }
  };

  const handleLoad = () => {
    const frame = frameRef.current;
    const name = screenName(frame);
    if (!name) return;
    let title = name;
    try {
      title = frame.contentDocument.title || name;
    } catch {
      /* cross-origin: keep the file name */
    }
    const key = toLight(name);
    if (goingBackRef.current) {
      goingBackRef.current = false;
    } else if (trailRef.current[trailRef.current.length - 1] !== key) {
      trailRef.current.push(key);
    }
    setCurrent({
      name,
      title: title.replace(/\s*\(dark\)$/i, "").replace(/^PC\s*·\s*/, "").replace(/\s*·\s*dark$/i, ""),
    });
  };

  const switchDevice = (next) => {
    if (next === device) return;
    trailRef.current = [];
    setFrameSrc(`${base}${toTheme(devices[next].home, theme, screens)}.html`);
    setDevice(next);
  };

  const switchTheme = (next) => {
    if (next === theme) return;
    setTheme(next);
    open(toTheme(current.name ?? spec.home, next, screens));
  };

  const back = () => {
    const trail = trailRef.current;
    if (trail.length < 2) return;
    trail.pop();
    goingBackRef.current = true;
    open(toTheme(trail[trail.length - 1], theme, screens));
  };

  const restart = () => {
    trailRef.current = [];
    open(startScreen);
  };

  // Phone: fit the screen to a comfortable height. Desktop: fit the width.
  const available = Math.max(stageWidth - 32, 200);
  const scale =
    device === "phone"
      ? Math.min(1, available / spec.width, 720 / spec.height)
      : Math.min(1, available / spec.width);
  const frameWidth = Math.round(spec.width * scale);
  const frameHeight = Math.round(spec.height * scale);
  const activeFlow = spec.flows.find(([, name]) => name === toLight(current.name ?? ""))?.[0];

  return (
    <div className={`lp lp--${device} lp--${theme}`}>
      <div className="lp-toolbar">
        <Segmented
          label="Device"
          value={device}
          options={Object.entries(devices).map(([id, d]) => [id, d.label])}
          onChange={switchDevice}
        />
        <Segmented
          label="Theme"
          value={theme}
          options={[
            ["light", "Light"],
            ["dark", "Dark"],
          ]}
          onChange={switchTheme}
        />
      </div>

      <div className="lp-flows" role="group" aria-label="Jump to a flow">
        {spec.flows.map(([label, name]) => (
          <button
            key={name}
            type="button"
            className={activeFlow === label ? "is-on" : undefined}
            onClick={() => open(toTheme(name, theme, screens))}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lp-stage" ref={stageRef}>
        {stageWidth > 0 ? (
          <div
            className="lp-device"
            style={{ width: frameWidth, height: frameHeight + (device === "desktop" ? 34 : 0) }}
          >
            {device === "desktop" ? (
              <div className="lp-window-bar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div className="lp-screen" style={{ width: frameWidth, height: frameHeight }}>
              <iframe
                key={device}
                ref={frameRef}
                title={`Loop prototype, ${spec.label.toLowerCase()}`}
                src={frameSrc}
                width={spec.width}
                height={spec.height}
                style={{ width: spec.width, height: spec.height, transform: `scale(${scale})` }}
                sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                onLoad={handleLoad}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="lp-status">
        <p className="lp-status__screen" aria-live="polite">
          <span className="lp-status__label">Screen</span>
          {current.title}
        </p>
        <div className="lp-status__actions">
          <button type="button" onClick={back} disabled={trailRef.current.length < 2}>
            Back
          </button>
          <button type="button" onClick={restart}>
            Start over
          </button>
        </div>
      </div>
      <p className="lp-hint">
        Tap around: buttons, rows and menus go where they would in the app.
      </p>
    </div>
  );
}
