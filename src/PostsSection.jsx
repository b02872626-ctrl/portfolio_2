import { useEffect, useRef, useState } from "react";
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
function InViewVideo({ item }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.play().catch(() => {});
        else node.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="post__media"
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

function Post({ item, onOpen }) {
  return (
    <button
      type="button"
      className="post"
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
      onClick={onOpen}
      aria-label={`View ${item.alt}`}
    >
      {item.type === "video" ? (
        <InViewVideo item={item} />
      ) : (
        <img className="post__media" src={item.thumb} alt="" loading="lazy" decoding="async" />
      )}
    </button>
  );
}

// One folder: a heading, then every post in a single row at the same height.
function FolderRail({ folder, onOpen }) {
  const railRef = useRef(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  // Every item in the folder, in order, so the viewer can step through all of them.
  const allItems = folder.groups.flatMap((group) => group.items);
  let runningIndex = 0;

  const updateEdges = () => {
    const rail = railRef.current;
    if (!rail) return;
    setEdges({
      atStart: rail.scrollLeft < 4,
      atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const page = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section className="folder" aria-labelledby={`folder-${folder.id}`}>
      <div className="folder__head">
        <h3 id={`folder-${folder.id}`} className="folder__name">
          {folder.name}
          <span className="folder__count">{countFolderPosts(folder)}</span>
        </h3>
        <div className="folder__controls">
          <button
            type="button"
            className="tab-button tab-button--icon"
            onClick={() => page(-1)}
            disabled={edges.atStart}
            aria-label={`Scroll ${folder.name} back`}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            className="tab-button tab-button--icon"
            onClick={() => page(1)}
            disabled={edges.atEnd}
            aria-label={`Scroll ${folder.name} forward`}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className="folder__rail" ref={railRef} onScroll={updateEdges}>
        {folder.groups.map((group, groupIndex) => {
          const startIndex = runningIndex;
          runningIndex += group.items.length;

          if (group.type === "carousel") {
            return (
              <figure key={groupIndex} className="carousel">
                <div className="carousel__slides">
                  {group.items.map((item, index) => (
                    <Post
                      key={item.src}
                      item={item}
                      onOpen={() => onOpen(allItems, startIndex + index, folder.name)}
                    />
                  ))}
                </div>
                <figcaption className="carousel__caption">
                  {group.title} · {group.items.length} slides
                </figcaption>
              </figure>
            );
          }

          return group.items.map((item, index) => (
            <Post
              key={item.src}
              item={item}
              onOpen={() => onOpen(allItems, startIndex + index, folder.name)}
            />
          ));
        })}
      </div>
    </section>
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
              <span>{viewer.title}</span>
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
              />
            ) : (
              <img key={item.src} className="post-viewer__media" src={item.src} alt={item.alt} />
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
  const [viewer, setViewer] = useState(null);

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

      {postFolders.map((folder) => (
        <FolderRail key={folder.id} folder={folder} onOpen={openViewer} />
      ))}

      <PostViewer viewer={viewer} onClose={() => setViewer(null)} onStep={stepViewer} />
    </section>
  );
}
