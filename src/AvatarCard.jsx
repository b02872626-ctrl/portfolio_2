import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import riveWasmUrl from "@rive-app/canvas/rive.wasm?url";
import "./avatar-card.css";

const islandSpring = { type: "spring", stiffness: 380, damping: 28 };

// The animated character, made in Rive. The runtime only loads when the
// card opens, so the homepage stays light.
function RiveCharacter() {
  const canvasRef = useRef(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let rive = null;
    let cancelled = false;

    import("@rive-app/canvas")
      .then(({ Rive, RuntimeLoader, Layout, Fit, Alignment }) => {
        if (cancelled || !canvasRef.current) return;
        RuntimeLoader.setWasmUrl(riveWasmUrl);
        rive = new Rive({
          src: "/assets/rive/breathing.riv",
          canvas: canvasRef.current,
          stateMachines: "State Machine 1",
          autoplay: true,
          layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
          onLoad: () => {
            if (cancelled) return;
            rive.resizeDrawingSurfaceToCanvas();
            setState("ready");
          },
          onLoadError: () => {
            if (!cancelled) setState("error");
          },
        });
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      rive?.cleanup();
    };
  }, []);

  return (
    <div className={`avatar-card__stage is-${state}`}>
      <canvas
        ref={canvasRef}
        className="avatar-card__canvas"
        width="520"
        height="520"
        role="img"
        aria-label="Animated illustration of Nahu breathing and looking around."
      />
      {state === "error" ? (
        <p className="avatar-card__error">The animation couldn&apos;t load.</p>
      ) : null}
    </div>
  );
}

export default function AvatarCard({ children, ...motionProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const shellRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!shellRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <motion.div className="profile-stack avatar-shell" ref={shellRef} {...motionProps}>
      <motion.button
        type="button"
        className={`profile-chip avatar-chip${isOpen ? " is-open" : ""}`}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="avatar-card"
        aria-label={isOpen ? "Close animated portrait" : "Open animated portrait"}
      >
        {children}
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="avatar-card"
            id="avatar-card"
            role="dialog"
            aria-label="Animated portrait"
            style={{ transformOrigin: "12% 0%" }}
            initial={{ opacity: 0, scale: 0.4, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: islandSpring }}
            exit={{ opacity: 0, scale: 0.4, y: -16, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
          >
            <span className="avatar-card__tab">Hello</span>
            <div className="avatar-card__body">
              <RiveCharacter />
              <p className="avatar-card__caption">
                <span>Nahu Gebreamlak</span>
                <span className="avatar-card__hint">Follows your cursor</span>
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
