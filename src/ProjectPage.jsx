import { useEffect } from "react";
import "./project-page.css";

const youTubeId = (value) => {
  const match =
    String(value ?? "").match(/[?&]v=([^&]+)/i) ??
    String(value ?? "").match(/youtu\.be\/([^?&]+)/i) ??
    String(value ?? "").match(/\/embed\/([^?&]+)/i);
  return match?.[1] ?? null;
};

// Silent, looping hero for motion work; controls stay so visitors can unmute.
const heroVideoSrc = (item) => {
  const id = item.videoId ?? youTubeId(item.videoUrl ?? item.embedUrl);
  if (!id) return item.embedUrl;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "1",
    rel: "0",
    playsinline: "1",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
};

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Black or white text, whichever reads better on the project colour.
const inkFor = (hex) => {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? "#111111" : "#ffffff";
};

// Turns a case study into: hero, summary, and a list of headed sections.
// Numbered "Gallery" chunks merge into one Gallery; a hidden-label chunk
// joins the section before it.
export const buildProjectPage = (caseStudy) => {
  const [overview, ...rest] = caseStudy.sections;
  const hero = overview.media[0] ?? null;
  const sections = [];
  let gallery = null;

  const addToGallery = (media) => {
    if (!gallery) {
      gallery = { heading: "Gallery", body: [], media: [] };
      sections.push(gallery);
    }
    gallery.media.push(...media);
  };

  if (overview.media.length > 1) addToGallery(overview.media.slice(1));

  rest.forEach((section) => {
    if (/^Gallery \d+$/.test(section.label)) {
      addToGallery(section.media);
    } else if (section.hideLabel) {
      const last = sections[sections.length - 1];
      if (last) last.media.push(...section.media);
      else addToGallery(section.media);
    } else {
      gallery = null;
      sections.push({ heading: section.label, body: section.body, media: [...section.media] });
    }
  });

  return {
    hero,
    summary: overview.body,
    sections: sections.map((section) => ({ ...section, id: slugify(section.heading) })),
  };
};

function MediaItem({ item, eager = false }) {
  if (item.type === "video") {
    return (
      <div className="pp-media__frame pp-media__frame--video">
        <iframe
          src={item.embedUrl}
          title={item.alt}
          loading={eager ? "eager" : "lazy"}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return <img src={item.src} alt={item.alt ?? ""} loading={eager ? "eager" : "lazy"} />;
}

function MediaGrid({ media }) {
  if (media.length === 0) return null;
  const single = media.length === 1;

  return (
    <div className={`pp-media${single ? " pp-media--single" : ""}`}>
      {media.map((item, index) => {
        const wide = !single && /--(wide|hero)/.test(item.className ?? "");
        return (
          <figure
            key={`${item.src ?? item.embedUrl}-${index}`}
            className={`pp-media__item${wide ? " pp-media__item--wide" : ""}`}
          >
            <MediaItem item={item} />
          </figure>
        );
      })}
    </div>
  );
}

const ArrowIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M8 20h24M22 10l10 10-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProjectPage({ project, nextProject, contact, onNavigate, onOpenCareer }) {
  const { caseStudy } = project;
  const page = buildProjectPage(caseStudy);
  const accent = project.accent ?? "#ff5b00";
  const accentInk = inkFor(accent);
  const deliverables = (
    caseStudy.credits.find((item) => /^(Format|Discipline)$/i.test(item.label))?.value ?? ""
  )
    .split(/,\s*/)
    .filter(Boolean);
  const credits = caseStudy.credits.filter(
    (item) => !/^(Format|Discipline|Project)$/i.test(item.label),
  );
  const behanceUrl = project.referenceUrl?.includes("behance.net") ? project.referenceUrl : null;

  useEffect(() => {
    const previous = document.title;
    document.title = `${project.displayTitle} | Nahu Gebreamlak`;
    return () => {
      document.title = previous;
    };
  }, [project.displayTitle]);

  const go = (event, to) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();
    onNavigate(to);
  };

  const heroIsVideo = page.hero?.type === "video";

  return (
    <div className="pp" style={{ "--pp-accent": accent, "--pp-accent-ink": accentInk }}>
      <header className="pp-topbar">
        <div className="pp-wrap pp-topbar__inner">
          <a href="/" className="pp-topbar__name" onClick={(event) => go(event, "/")}>
            Nahu Gebreamlak
          </a>
          <nav aria-label="Main" className="pp-topbar__nav">
            <a href="/" onClick={(event) => go(event, "/")}>
              Projects
            </a>
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                onOpenCareer();
              }}
            >
              Career
            </a>
            <a className="pp-topbar__contact" href={`mailto:${contact.email}`}>
              Get in touch
            </a>
          </nav>
        </div>
      </header>

      <main className="pp-wrap">
        <section id="top" className="pp-intro">
          <nav aria-label="Breadcrumb" className="pp-breadcrumb">
            <a href="/" onClick={(event) => go(event, "/")}>
              Projects
            </a>
            <span aria-hidden="true">/</span>
            <a href="/" onClick={(event) => go(event, "/")}>
              {project.group}
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.displayTitle}</span>
          </nav>

          <div className="pp-intro__copy">
            <h1>{project.displayTitle}</h1>
            {page.summary.map((paragraph) => (
              <p key={paragraph} className="pp-intro__summary">
                {paragraph}
              </p>
            ))}
            {deliverables.length > 0 ? (
              <ul className="pp-tags" aria-label="Deliverables">
                {deliverables.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {page.hero ? (
          <figure className={`pp-hero${heroIsVideo ? " pp-hero--video" : ""}`}>
            {heroIsVideo ? (
              <iframe
                src={heroVideoSrc(page.hero)}
                title={`${project.displayTitle} video`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <img src={page.hero.src} alt={page.hero.alt ?? ""} />
            )}
          </figure>
        ) : null}

        <div className="pp-body">
          <aside className="pp-rail" aria-label="On this page">
            <p className="pp-rail__label">On this page</p>
            <a className="pp-rail__title" href="#top">
              {project.displayTitle}
            </a>
            <ul>
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <ChevronIcon />
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#credits">
                  <ChevronIcon />
                  Credits
                </a>
              </li>
            </ul>
          </aside>

          <div className="pp-content">
            {page.sections.map((section) => (
              <section key={section.id} className="pp-section" aria-labelledby={section.id}>
                <h2 id={section.id}>{section.heading}</h2>
                {section.body.length > 0 ? (
                  <div className="pp-section__body">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                <MediaGrid media={section.media} />
              </section>
            ))}

            <section id="credits" className="pp-section pp-credits" aria-labelledby="credits-heading">
              <h2 id="credits-heading">Credits</h2>
              <dl>
                {credits.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
                {behanceUrl ? (
                  <div>
                    <dt>Also on</dt>
                    <dd>
                      <a href={behanceUrl} target="_blank" rel="noreferrer">
                        Behance
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          </div>
        </div>

        <section className="pp-ending" aria-label="Next steps">
          <div className="pp-ending__contact">
            <p className="pp-eyebrow">Work with me</p>
            <div>
              <h2>Have a project in mind?</h2>
              <a href={`mailto:${contact.email}`}>Get in touch</a>
            </div>
          </div>
          {nextProject ? (
            <a
              className="pp-ending__next"
              href={`/projects/${nextProject.slug}`}
              onClick={(event) => go(event, `/projects/${nextProject.slug}`)}
            >
              <span className="pp-eyebrow">Next project</span>
              <span className="pp-ending__next-row">
                <span>
                  <span className="pp-ending__next-title">{nextProject.displayTitle}</span>
                  <span className="pp-ending__next-category">{nextProject.source}</span>
                </span>
                <ArrowIcon />
              </span>
            </a>
          ) : null}
        </section>

        <footer className="pp-footer">
          <span>© {new Date().getFullYear()} Nahu Gebreamlak</span>
          <span className="pp-footer__links">
            {contact.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            <a href={`mailto:${contact.email}`}>Email</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
