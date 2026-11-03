import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { countFolderPosts, postFolders } from "./posts.js";
import "./posts-section.css";

const ArrowIcon = ({ direction = "right" }) => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    aria-hidden="true"
    style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
  >
    <path
      d="M4 8h8M8.5 4.5L12 8l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plays silently while on screen, pauses when scrolled away.
function InViewVideo({ item, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

function PostTile({ item, onOpen, className = "" }) {
  return (
    <button
      type="button"
      className={`post-tile ${className}`}
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
      onClick={onOpen}
      aria-label={`View ${item.alt}`}
    >
      {item.type === "video" ? (
        <>
          <InViewVideo item={item} className="post-tile__media" />
          <span className="post-tile__badge" aria-hidden="true">
            <svg viewBox="0 0 18 18" width="14" height="14">
              <path d="M6 4l8 5-8 5V4z" fill="currentColor" />
            </svg>
          </span>
        </>
      ) : (
        <img className="post-tile__media" src={item.thumb} alt="" loading="lazy" decoding="async" />
      )}
    </button>
  );
}

function CarouselStrip({ group, onOpen }) {
  const stripRef = useRef(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = () => {
    const strip = stripRef.current;
    if (!strip) return;
    setEdges({
      atStart: strip.scrollLeft < 4,
      atEnd: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const scrollBySlide = (direction) => {
    const strip = stripRef.current;
    const slide = strip?.querySelector(".post-carousel__slide");
    if (!strip || !slide) return;
    strip.scrollBy({ left: direction * slide.getBoundingClientRect().width, behavior: "smooth" });
  };

  return (
    <div className="post-carousel">
      <div className="post-carousel__head">
        <p className="post-carousel__title">
          {group.title}
          <span className="post-carousel__count">{group.items.length} slides</span>
        </p>
        <div className="post-carousel__controls">
          <button
            type="button"
            className="tab-button tab-button--icon"
            onClick={() => scrollBySlide(-1)}
            disabled={edges.atStart}
            aria-label={`Previous slide in ${group.title}`}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            className="tab-button tab-button--icon"
            onClick={() => scrollBySlide(1)}
            disabled={edges.atEnd}
            aria-label={`Next slide in ${group.title}`}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className="post-carousel__strip" ref={stripRef} onScroll={updateEdges}>
        {group.items.map((item, index) => (
          <PostTile
            key={item.src}
            item={item}
            className="post-carousel__slide"
            onOpen={() => onOpen(group.items, index, group.title)}
          />
        ))}
      </div>
    </div>
  );
}

function PostViewer({ viewer, onClose, onStep }) {
  const dialogRef = useRef(null);
  const touchStart = useRef(null);
  const open = Boolean(viewer);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onStep]);

  const item = viewer ? viewer.items[viewer.index] : null;
  const total = viewer?.items.length ?? 0;

  return (
    <dialog
      ref={dialogRef}
      className="post-viewer"
      aria-label={item ? item.alt : "Post viewer"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget || event.target.classList.contains("post-viewer__stage")) {
          onClose();
        }
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current == null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(delta) > 50) onStep(delta < 0 ? 1 : -1);
      }}
    >
      {item ? (
        <>
          <div className="post-viewer__bar">
            <p className="post-viewer__label">
              {viewer.title ? <span>{viewer.title}</span> : null}
              {total > 1 ? (
                <span className="post-viewer__count">
                  {String(viewer.index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              ) : null}
            </p>
            <button type="button" className="tab-button tab-button--icon" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="post-viewer__stage">
            {item.type === "video" ? (
              <video
                key={item.src}
                className="post-viewer__media"
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                loop
                playsInline
                style={{ aspectRatio: `${item.w} / ${item.h}` }}
              />
            ) : (
              <img
                key={item.src}
                className="post-viewer__media"
                src={item.src}
                alt={item.alt}
                style={{ aspectRatio: `${item.w} / ${item.h}` }}
              />
            )}
          </div>

          {total > 1 ? (
            <div className="post-viewer__nav">
              <button
                type="button"
                className="tab-button tab-button--icon"
                onClick={() => onStep(-1)}
                disabled={viewer.index === 0}
                aria-label="Previous"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className="tab-button tab-button--icon"
                onClick={() => onStep(1)}
                disabled={viewer.index === total - 1}
                aria-label="Next"
              >
                <ArrowIcon />
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </dialog>
  );
}

export default function PostsSection() {
  const [activeId, setActiveId] = useState(postFolders[0].id);
  const [viewer, setViewer] = useState(null);
  const activeFolder = postFolders.find((folder) => folder.id === activeId) ?? postFolders[0];
  const activeIndex = postFolders.indexOf(activeFolder);

  const openViewer = (items, index, title) => setViewer({ items, index, title });
  const stepViewer = (direction) =>
    setViewer((current) => {
      if (!current) return current;
      const next = current.index + direction;
      if (next < 0 || next >= current.items.length) return current;
      return { ...current, index: next };
    });

  return (
    <section className="posts" aria-labelledby="posts-title">
      <h2 id="posts-title" className="posts__sr-only">
        Post design
      </h2>

      <div className="posts__tabs" role="tablist" aria-label="Post folders">
        {postFolders.map((folder, index) => {
          const isActive = folder.id === activeFolder.id;
          return (
            <button
              key={folder.id}
              type="button"
              role="tab"
              id={`posts-tab-${folder.id}`}
              aria-selected={isActive}
              aria-controls="posts-panel"
              tabIndex={isActive ? 0 : -1}
              className={`posts__tab${isActive ? " is-active" : ""}`}
              style={{ zIndex: isActive ? postFolders.length + 1 : postFolders.length - index }}
              onClick={() => setActiveId(folder.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                const step = event.key === "ArrowRight" ? 1 : -1;
                const next = postFolders[(index + step + postFolders.length) % postFolders.length];
                setActiveId(next.id);
                document.getElementById(`posts-tab-${next.id}`)?.focus();
              }}
            >
              <span className="posts__tab-name">{folder.name}</span>
              <span className="posts__tab-count">{countFolderPosts(folder)}</span>
            </button>
          );
        })}
      </div>

      <div
        id="posts-panel"
        className={`posts__folder${activeIndex === 0 ? " is-first" : ""}`}
        role="tabpanel"
        aria-labelledby={`posts-tab-${activeFolder.id}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeFolder.id}
            className="posts__folder-inner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="posts__folder-head">
              <p className="posts__folder-name">{activeFolder.name}</p>
              <p className="posts__folder-meta">
                {countFolderPosts(activeFolder)} posts
              </p>
            </div>

            {activeFolder.groups.map((group, groupIndex) =>
              group.type === "carousel" ? (
                <CarouselStrip key={`${activeFolder.id}-${groupIndex}`} group={group} onOpen={openViewer} />
              ) : (
                <div
                  key={`${activeFolder.id}-${groupIndex}`}
                  className={`post-grid${group.layout === "stories" ? " post-grid--stories" : ""}`}
                >
                  {group.items.map((item, index) => (
                    <PostTile
                      key={item.src}
                      item={item}
                      onOpen={() => openViewer(group.items, index, activeFolder.name)}
                    />
                  ))}
                </div>
              ),
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <PostViewer viewer={viewer} onClose={() => setViewer(null)} onStep={stepViewer} />
    </section>
  );
}
