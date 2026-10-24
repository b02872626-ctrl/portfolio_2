import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MusicPlayer from "./MusicPlayer.jsx";
import ContactDialog from "./ContactDialog.jsx";
import ProjectPage from "./ProjectPage";

// "Fun stuff I made" is hidden until the section is ready; add it back here to show it.
const navLinks = ["Projects"];
const careerEntries = [
  {
    role: "Product Designer",
    company: "AFRIWORK",
    description:
      "Storytelling-led visual work shaped by a background in graphic design, motion design, and brand identity, with a focus on helping brands connect and convert.",
  },
  {
    role: "Senior Graphic Designer",
    company: "ARMA ADVERTISING",
    description:
      "Agency-facing design built around strong visual storytelling, careful detail, and polished campaign assets that help brands move people.",
  },
  {
    role: "Senior Graphic Designer",
    company: "DIGITAL ADDIS",
    description:
      "Senior-level visual direction informed by brand thinking, motion awareness, and a craft-driven approach to client and campaign communication.",
  },
  {
    role: "Graphic Designer",
    company: "DIGITAL ADDIS",
    description:
      "Hands-on graphic design work focused on clear layouts, visual consistency, and story-first execution across everyday brand materials.",
  },
  {
    role: "Junior Graphic Designer",
    company: "GREATER ACADEMY",
    description:
      "An early design foundation shaped by visual communication, layout, and detail, helping build the storytelling instincts carried into later work.",
  },
];
const careerSummaryLabel = "Graphic design, motion design, brand identity, and storytelling";
const careerProfile = {
  eyebrow: "About me",
  intro: "Helping brands and agencies tell stories that move.",
  body: [
    "I help brands move people through motion, design, and storytelling. As the founder of Studio Rass, I work with startups, agencies, and creative teams to craft visuals that connect and convert.",
    "With a background in graphic design, motion design, and cinematography, I bring an eye for storytelling and detail to every project, from product launch videos to brand identity systems and campaign visuals.",
  ],
  skills: [
    { label: "Motion Designer" },
    { label: "Graphic Designer" },
    { label: "3D Artist" },
  ],
};
const funStuffPanel = {
  eyebrow: "Fun stuff I made",
  title: "This section is getting rebuilt.",
  subtitle:
    "Loose drops, experiments, behind-the-scenes frames, and whatever else deserves a spot here.",
  note: "The old feed is gone for now. Fresh work will land here in a new format soon.",
  artwork: "/assets/fun-stuff-coming-soon.svg",
};
const motionProjectTitles = new Set([
  "Air pods Max",
  "Marshall.",
  "Show reel - 2025",
  "Afriwork Platform",
  "Afriwork Ai",
  "Caynetic Voice - Ad",
  "Chapa",
  "Hanbon Construction",
]);
const profileImageCandidates = [
  "/assets/profile_jpeg.jpeg",
  "/assets/profile_jpeg.jpg",
  "/assets/profile_jpeg.png",
];
const extractBehanceProjectId = (value) => {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value);
  const match =
    normalizedValue.match(/\/gallery\/(\d+)/i) ??
    normalizedValue.match(/\/embed\/project\/(\d+)/i) ??
    normalizedValue.match(/\b(\d{6,})\b/);

  return match?.[1] ?? null;
};

const buildBehanceEmbedUrl = (value) => {
  const projectId = extractBehanceProjectId(value);
  return projectId
    ? `https://www.behance.net/embed/project/${projectId}?ilo0=1`
    : null;
};

const getYouTubeVideoId = (value) => {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value);
  const match =
    normalizedValue.match(/[?&]v=([^&]+)/i) ??
    normalizedValue.match(/youtu\.be\/([^?&]+)/i) ??
    normalizedValue.match(/\/embed\/([^?&]+)/i);

  return match?.[1] ?? null;
};

const buildYouTubeEmbedUrl = (value) => {
  const videoId = getYouTubeVideoId(value);
  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "1",
    rel: "0",
    playsinline: "1",
    modestbranding: "1",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const chunkItems = (items, size) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const balanceGalleryChunk = (chunk, chunkIndex) => {
  if (chunk.length === 1) {
    return chunk.map((item) => ({ ...item, className: "project-case-study__media--wide" }));
  }

  if (chunk.length === 2) {
    return chunk;
  }

  if (chunk.length === 3) {
    const wideIndex = chunkIndex % 2 === 0 ? 0 : 2;

    return chunk.map((item, itemIndex) =>
      itemIndex === wideIndex
        ? { ...item, className: "project-case-study__media--wide" }
        : item
    );
  }

  if (chunk.length === 4) {
    return chunk.map((item, itemIndex) =>
      itemIndex < 2 ? { ...item, className: "project-case-study__media--wide" } : item
    );
  }

  return chunk.map((item, itemIndex) =>
    itemIndex === 0 || itemIndex === chunk.length - 1
      ? { ...item, className: "project-case-study__media--wide" }
      : item
  );
};

const createBehanceGalleryCaseStudy = ({
  title,
  eyebrow,
  format,
  summary,
  imageUrls,
  credits = [],
}) => {
  const images = imageUrls.map((src, index) => ({
    src,
    alt: `${title}, image ${String(index + 1).padStart(2, "0")}.`,
    className: index === 0 ? "project-case-study__media--hero" : undefined,
  }));

  const [heroImage, ...galleryImages] = images;
  const chunks = chunkItems(galleryImages, 6);
  // The gallery is visual-only; the last block carries the credits.
  const gallerySections = chunks.map((chunk, chunkIndex) => {
    const isLast = chunkIndex === chunks.length - 1;

    return {
      label: isLast ? "Credits" : `Gallery ${chunkIndex + 1}`,
      layout: isLast ? undefined : "gallery",
      hideLabel: isLast,
      body: [],
      media: balanceGalleryChunk(chunk, chunkIndex),
    };
  });

  return {
    eyebrow,
    sections: [
      {
        label: "Overview",
        body: [summary],
        media: heroImage ? [heroImage] : [],
      },
      ...gallerySections,
    ],
    credits: [
      { label: "Project", value: title },
      { label: "Format", value: format },
      ...credits,
    ],
  };
};

const createBehanceMediaItems = (title, imageUrls) =>
  imageUrls.map((src, index) => ({
    src,
    alt: `${title}, image ${String(index + 1).padStart(2, "0")}.`,
    className: index === 0 ? "project-case-study__media--hero" : undefined,
  }));

const createVideoMediaItem = (title, embedUrl, options = {}) => ({
  type: "video",
  videoUrl: embedUrl,
  embedUrl: options.useExactEmbedUrl ? embedUrl : buildYouTubeEmbedUrl(embedUrl) ?? embedUrl,
  videoId: getYouTubeVideoId(embedUrl),
  alt: title,
  className: "project-case-study__media--hero",
});

const createVideoFeatureCaseStudy = ({
  title,
  eyebrow,
  embedUrl,
  summary,
  format,
  credits = [],
  stills = [],
}) => ({
  eyebrow,
  sections: [
    {
      label: "Overview",
      body: Array.isArray(summary) ? summary : [summary],
      media: [createVideoMediaItem(title, embedUrl)],
      showCredits: true,
    },
    ...(stills.length > 0
      ? [
          {
            label: "Stills",
            layout: "gallery",
            body: [],
            media: stills.map(([file, alt]) => ({ src: `/assets/stills/${file}`, alt })),
          },
        ]
      : []),
  ],
  credits: [
    ...credits,
    { label: "Format", value: format },
    { label: "Studio", value: "StudioRass" },
  ],
});

let youtubeApiPromise;

const loadYouTubeApi = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);
  });

  return youtubeApiPromise;
};

const ttechnosBehanceImages = [
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/82e0b2210173327.670d035528c89.png",
    alt: "Ttechnos hero image.",
    className: "project-case-study__media--hero",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/7fd258210173327.670d03552682b.png",
    alt: "Ttechnos image showing a light logo lockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/edabb9210173327.670d035526d61.png",
    alt: "Ttechnos image showing a red logo lockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/83fae3210173327.670d03552b00e.png",
    alt: "Ttechnos image showing mark construction details.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5ad38f210173327.670d03552b8ad.png",
    alt: "Ttechnos typography board one.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/6c103d210173327.670d03552913f.png",
    alt: "Ttechnos typography board two.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/41df8d210173327.670d035527dd6.png",
    alt: "Ttechnos color palette board.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e10298210173327.670d0355274de.png",
    alt: "Ttechnos gradient study.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/aa8b75210173327.670d035527960.png",
    alt: "Ttechnos application poster.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c9123210173327.670d03552852f.png",
    alt: "Ttechnos applications collage.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c9644e210173327.670d03552c8e1.png",
    alt: "Ttechnos billboard mockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/27ea3a210173327.670d03552cd95.png",
    alt: "Ttechnos image 12.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/969c88210173327.670d0355295b3.png",
    alt: "Ttechnos image 13.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2bae84210173327.670d03552a631.png",
    alt: "Ttechnos image 14.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c4116210173327.670d03552a190.png",
    alt: "Ttechnos image 15.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8e04ff210173327.670d03552dbbd.png",
    alt: "Ttechnos image 16.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/14520d210173327.670d03552c00b.png",
    alt: "Ttechnos image 17.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ec3b14210173327.670d03552ab2e.png",
    alt: "Ttechnos image 18.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5cddab210173327.670d03552d49f.png",
    alt: "Ttechnos image 19.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c5adf210173327.670d035529a13.png",
    alt: "Ttechnos image 20.",
    className: "project-case-study__media--wide",
  },
];

const behanceProjectImageSets = {
  halalCatering: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8c1628210007661.67094b3d72eea.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/0eabd4210007661.67094b3d73621.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/775989210007661.67094b3d73bf5.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a27b90210007661.67094b3d7241e.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/db15b9210007661.67094b3d745c4.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3b3cac210007661.67094b3d760c9.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a34163210007661.67094b3d754c5.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f7c6a7210007661.67094b3d779bb.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3e400d210007661.67094b3d78201.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/254521210007661.67094b3d768d6.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d047d1210007661.67094b3d773a4.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/91ba18210007661.67094b3d78d6e.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/61259e210007661.67094b3d787cb.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c664e3210007661.67094b3d79325.jpg",
  ],
  womenInMuya: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/1437a8209914781.6707baee8cfbc.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/cca52d209914781.6707baee89db8.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8d748c209914781.6708256f5a5dd.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/347ed3209914781.6707baee894fb.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5421ef209914781.6707baee88c2a.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5f9ea9209914781.6707baee8d86b.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/89826b209914781.6707baee8af1f.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/0bffb6209914781.6707baee8b7c4.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/931280209914781.6707baee86e08.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/439463209914781.6707baee87571.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a7b2e9209914781.6707baee88366.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/bab296209914781.6707baee87c60.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f97df8209914781.6707baee8a672.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/6751a3209914781.6707baee8c8cf.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f0ee5d209914781.6707baee8c058.png",
  ],
  liteInnovate: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/793a24210708431.671657f66b5a2.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fd7bfd210708431.671657f66eca9.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/1cbaff210708431.671657f66fbc3.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ce3e78210708431.671657f66dede.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e9ce82210708431.671657f670e10.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/930957210708431.671657f668dec.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/debcdc210708431.671657f66d628.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b55c8f210708431.671657f66a160.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/cfd055210708431.671657f66f5dd.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/910392210708431.671657f66acce.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/29a48b210708431.671657f66d086.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/700f76210708431.671657f668487.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/44942a210708431.671657f66cb1a.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ebcc4a210708431.671657f66c5eb.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/279f50210708431.671657f67051f.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5944d8210708431.671657f66a713.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d86b33210708431.671657f66979d.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/0f9b97210708431.671657f66e425.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a7379d210708431.671657f405020.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e3f27a210708431.671657f4063aa.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d9e1bd210708431.671657f405d6d.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/24189b210708431.671657f667908.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/70254c210708431.671657f66c092.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e90916210708431.671657f66bb1f.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/9e70a2210708431.671657f667095.png",
  ],
  alenelachu: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/adf863199019247.664b21931814e.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c81a0a199019247.664b21931860e.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c452ad199019247.664b219318a82.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f44329199019247.664b219319ced.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/441194199019247.664b21931a403.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2a5899199019247.664b21931a863.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/7a49ac199019247.664b21931acb7.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/69a664199019247.664b21931b3b5.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a47739199019247.664b21931bf0c.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b00028199019247.664b219318eda.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/caf768199019247.664b21931baca.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/4e1b09199019247.664b2193195e7.png",
  ],
  airpodMax: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/91d67c193955523.6718faa9a4fe3.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/0e6c49193955523.671919c5a2c36.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/aff2ea193955523.6613b9415efd5.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/46264a193955523.671919c5a0d93.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/972708193955523.671919c5a4063.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/1fcc03193955523.671919c5a223a.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a2e197193955523.671919c59ec76.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/150aa8193955523.671919c5a17ae.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/595ff0193955523.671919c5a3475.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/10923f193955523.671919c59f764.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5f09b9193955523.67191ab6c078e.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5844f3193955523.67194ac9ee721.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d2f4e0193955523.67194ac9ef2b9.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3038a3193955523.67194ac9ec7fe.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5c2f16193955523.67194ac9ed0eb.png",
  ],
  marshall: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c94b6e193789767.671a3fc7a5439.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a07e66193789767.671a3fc7a7b73.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/7878b9193789767.671a3fc7aa6dc.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e8c473193789767.65f196268a523.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d7c5a2193789767.671a3fc7a5f53.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/dfadf1193789767.671a3fc7a948c.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d67ff3193789767.65f1962688b9e.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/883def193789767.65f1962687d31.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8e4f92193789767.671a3fc7a4aa7.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b874c0193789767.671a3fc7abd1b.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/569759193789767.65f196268991a.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/19fb9b193789767.65f1962686fb9.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/12693b193789767.671a3fc7a6a04.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/95db26193789767.671a3fc7a9ad4.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/51cea0193789767.671a3fc7aacb8.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f3d689193789767.671a3fc7a8cca.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/45a344193789767.671a3fc7a727c.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e26bf9193789767.671a3fc7a842a.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/89015c193789767.671a3fc7aa0e6.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b2d8a0193789767.671a3fc7ab598.png",
  ],
  showReel: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/cd6e10231914735.68922512c41d8.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ed6432231914735.68922512c4bd0.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/026db6231914735.6892250f2015d.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8fbbff231914735.6892250f1e805.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/4d2811231914735.6892250f1ee5d.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/88371c231914735.6892250f1e123.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/4d2ba1231914735.6892250f1fc45.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/1ec988231914735.6892250f1f451.png",
  ],
};

const ttechnosCaseStudy = {
  eyebrow: "Ttechnos LLC / Identity System",
  sections: [
    {
      label: "Overview",
      body: [
        "Ttechnos LLC needed an identity that could feel modern, technical, and dependable without losing warmth. The system had to communicate infrastructure, connection, and innovation at a glance.",
        'The final direction centers on a linked double-T symbol built from abstract geometric forms. That construction gives the mark a sense of systems thinking and precision while keeping the silhouette minimal, scalable, and memorable.',
      ],
      media: [ttechnosBehanceImages[0]],
    },
    {
      label: "Mark System",
      body: [
        'The linked double-T symbol is built from abstract geometric forms that feel infrastructural, connected, and precise. That construction lets the mark stay iconic even when the system is reduced to its simplest lockups.',
        "Paired with lighter and bolder logo moments, the identity can move between quiet brand signatures and more graphic campaign statements without losing recognition.",
      ],
      media: ttechnosBehanceImages.slice(1, 4),
    },
    {
      label: "Typography",
      body: [
        "Clash Grotesk leads the identity with a confident, contemporary voice, while Inter supports the system with clarity in smaller interfaces and supporting communication.",
        "Together they create a hierarchy that feels modern and legible, balancing strong brand presence with everyday usability across digital and print applications.",
      ],
      media: ttechnosBehanceImages.slice(4, 6),
    },
    {
      label: "Color System",
      body: [
        "A red-to-black gradient introduces urgency and momentum, giving the identity a stronger sense of movement while keeping the tone grounded in technology and infrastructure.",
        "The supporting palette adds contrast and flexibility, allowing the system to shift naturally between product communication, presentations, and campaign material.",
      ],
      media: ttechnosBehanceImages.slice(6, 8),
    },
    {
      label: "Applications",
      body: [
        "The identity expands naturally into posters, out-of-home placements, and campaign compositions, holding together across scale shifts and different levels of visual density.",
        "That flexibility makes the system practical as well as distinctive. It can feel polished in formal brand settings and energetic in promotional moments without looking like a different brand.",
      ],
      media: ttechnosBehanceImages.slice(8, 11),
    },
    {
      label: "Rollout",
      body: [],
      layout: "gallery",
      media: ttechnosBehanceImages.slice(11, 15),
    },
    {
      label: "Credits",
      hideLabel: true,
      body: [],
      media: ttechnosBehanceImages.slice(15),
    },
  ],
  credits: [
    { label: "Client", value: "Ttechnos LLC" },
    { label: "Studio", value: "Studio Rass" },
    {
      label: "Design",
      value: "Nahusenay Gebreamlak, Natnael Getinet, Aklog Tefera",
    },
    { label: "Discipline", value: "Logo Design, Branding, Visual Identity" },
    { label: "Published", value: "October 14, 2024" },
  ],
};

const halalCateringCaseStudy = createBehanceGalleryCaseStudy({
  title: "Halal Catering",
  eyebrow: "Halal Catering / Logo Design and Identity",
  format: "Logo Design, Brand Identity",
  summary:
    "Logo and identity for Halal Catering, from the core mark and its supporting visual language to a broad set of branded applications.",
  imageUrls: behanceProjectImageSets.halalCatering,
});

// Women In Muya is split into the sections from the approved page design.
// Indexes follow the Behance board order.
const womenInMuyaImage = (index, alt, wide = false) => ({
  src: behanceProjectImageSets.womenInMuya[index],
  alt,
  className: wide ? "project-case-study__media--wide" : undefined,
});

const womenInMuyaCaseStudy = {
  eyebrow: "Women In Muya / Brand Identity",
  sections: [
    {
      label: "Overview",
      body: [
        "Logo and identity system for Women in Muya, a community brand in Addis Ababa, carried from the wordmark and palette through posters, signage, merchandise and social.",
      ],
      media: [womenInMuyaImage(0, "Women in Muya poster on a street wall.")],
    },
    {
      label: "Logo",
      body: [],
      media: [
        womenInMuyaImage(2, "The Women in Muya wordmark drawn in outline, showing its construction."),
        womenInMuyaImage(5, "The Women in Muya logo on creamy black."),
      ],
    },
    {
      label: "Colour & type",
      body: [],
      media: [
        womenInMuyaImage(1, "The tagline 'What you want, when you need it.' set in the brand serif.", true),
        womenInMuyaImage(3, "Palette board: orange, creamy black and off white."),
        womenInMuyaImage(4, "Typeface board with the alphabet and numerals."),
      ],
    },
    {
      label: "In the world",
      body: [],
      media: [
        womenInMuyaImage(6, "Poster on an advertising column."),
        womenInMuyaImage(12, "Orange sandwich-board sign with the logo."),
        womenInMuyaImage(9, "A wall of Women in Muya posters.", true),
        womenInMuyaImage(10, "Billboard with the campaign line.", true),
        womenInMuyaImage(7, "Campaign layout with two hands reaching."),
        womenInMuyaImage(8, "Orange t-shirt with the campaign line."),
        womenInMuyaImage(11, "Tote bag with the campaign line."),
        womenInMuyaImage(13, "Three social posts."),
        womenInMuyaImage(14, "The logo as a phone app icon.", true),
      ],
    },
  ],
  credits: [
    { label: "Project", value: "Women In Muya" },
    { label: "Format", value: "Logo Design, Identity Design, Branding" },
    { label: "Client", value: "Rediet Pawlos & Bisrat Hagos" },
    { label: "Studio", value: "Studio Rass" },
    { label: "Design", value: "Nahusenay Gebreamlak, Natnael Getinet, Aklog Tefera" },
    { label: "Timeline", value: "2 months, 2024" },
  ],
};

const liteInnovateCaseStudy = createBehanceGalleryCaseStudy({
  title: "Lite Innovate",
  eyebrow: "Lite Innovate / Logo and Visual Identity",
  format: "Logo Design, Visual Identity",
  summary:
    "Logo and visual identity for Lite Innovate, moving from the core mark into supporting graphics, layouts and a broad set of brand applications.",
  imageUrls: behanceProjectImageSets.liteInnovate,
});

const alenelachuCaseStudy = createBehanceGalleryCaseStudy({
  title: "Alenelachu",
  eyebrow: "Alenelachu / Logo Design",
  format: "Logo Design, Identity Presentation",
  summary:
    "Logo design for Alenelachu, developed from early exploration into a mark that holds up across branded applications.",
  imageUrls: behanceProjectImageSets.alenelachu,
});

const airpodMaxMedia = createBehanceMediaItems("Air pods Max", behanceProjectImageSets.airpodMax)
  .filter((_, index) => ![0, 3, 6, 7, 9, 10, 12].includes(index));

const airpodMaxCaseStudy = {
  eyebrow: "Air pods Max / Spec Product Commercial",
  sections: [
    {
      label: "Overview",
      body: [
        "A StudioRass spec commercial for the AirPods Max, built around the product's clean industrial design and premium simplicity. The direction leans into precision, restraint and surface quality.",
        "Instead of overwhelming the product with effects, the piece stays focused on the form itself and uses that control to make the commercial feel polished, intentional, and highly product-led.",
      ],
      media: [
        createVideoMediaItem(
          "Air pods Max",
          "https://www.youtube.com/embed/hIgLN02pkuk",
          { useExactEmbedUrl: true },
        ),
      ],
    },
    {
      label: "The Challenge",
      body: [
        "The key question was how to show the power of the AirPods Max while staying faithful to its minimalist character. That tension shaped the motion language, the framing and the pacing.",
        "The project solves that by keeping the direction controlled and elegant, so the renders can feel premium without ever drifting away from the product's original design logic.",
      ],
      media: balanceGalleryChunk(airpodMaxMedia.slice(0, 2), 0),
    },
    {
      label: "Animation Stills",
      layout: "media-only",
      body: [],
      media: [airpodMaxMedia[2]],
    },
    {
      label: "Craft",
      body: [
        "The piece is built on careful 3D modeling and texturing. Surfaces, mesh and hardware details are treated as the core storytelling tools rather than background decoration.",
        "That attention to detail lets the headphones hold the frame on their own and gives the spec commercial its sense of finish, clarity, and confidence.",
      ],
      media: [airpodMaxMedia[3]],
    },
    {
      label: "Billboard Frame",
      layout: "media-only",
      body: [],
      media: [airpodMaxMedia[4]],
    },
    {
      label: "Applications",
      body: [
        "The direction extends into colorway visuals, product stills and social campaign frames, showing how the same product language stretches across placements without losing consistency.",
        "By the end of the sequence, the project reads as both a passion-led exercise and a proof of craft for StudioRass, turning a speculative commercial into a convincing product campaign study.",
      ],
      media: balanceGalleryChunk(airpodMaxMedia.slice(5), 2),
    },
  ],
  credits: [
    { label: "Project", value: "Air pods Max" },
    { label: "Format", value: "Spec Product Commercial" },
    { label: "Studio", value: "StudioRass" },
  ],
};

const marshallMedia = createBehanceMediaItems("Marshall.", behanceProjectImageSets.marshall)
  .filter((_, index) => ![0, 4, 8, 12, 14, 16].includes(index));

const marshallCaseStudy = {
  eyebrow: "Marshall. / Action III Product Commercial",
  sections: [
    {
      label: "Overview",
      body: [
        "A StudioRass spec commercial for the Marshall Action III, built around the idea of new sound with old soul. The speaker is treated as an object with weight, texture and attitude rather than smoothed into a generic tech ad.",
      ],
      media: [createVideoMediaItem("Marshall.", "https://www.youtube.com/embed/zLti1JwgfXE")],
    },
    {
      label: "The Vision",
      body: [
        "The direction was never meant to mimic the ultra-clean language of most product commercials. The goal was something warmer, grittier and closer to Marshall's classic presence.",
        "That choice gives the project its energy, letting the frames feel musical and tactile instead of overly sterile or trend-driven.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(1, 5), 0),
    },
    {
      label: "The Process",
      body: [
        "A detailed 3D model, rich textures and warm lighting are the foundation of the look. They keep the product feeling physical and familiar even as the frames become more graphic and campaign-led.",
        "Across the renders, the vintage cues are preserved on purpose, so the speaker stays recognizably Marshall while still reading clearly inside a modern commercial system.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(5, 9), 1),
    },
    {
      label: "The Challenge",
      body: [
        "The main challenge was the contrast between Marshall's retro-inspired design and the minimalist, high-gloss product language people associate with brands like Apple or Samsung. The project leans into that contrast instead of hiding it.",
        "By embracing the speaker's texture, warmth, and heritage, the commercial turns difference into its main strength and gives the work a much more memorable point of view.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(9, 12), 2),
    },
    {
      label: "The Result",
      body: [
        "The final frames land as a bold retro revival, ready for billboards, commercials and social placements, with one visual direction that scales without losing the product's timeless edge.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(12), 3),
    },
  ],
  credits: [
    { label: "Project", value: "Marshall." },
    { label: "Format", value: "Spec Product Commercial" },
    { label: "Studio", value: "StudioRass" },
  ],
};

const showReelCaseStudy = createVideoFeatureCaseStudy({
  title: "Show reel - 2025",
  eyebrow: "StudioRass / Show reel - 2025",
  embedUrl: "https://www.youtube.com/embed/DUNPRyTdXM0",
  summary:
    "Selected StudioRass motion work from 2025.",
  format: "Show Reel, Motion Showcase",
});

const afriworkPlatformCaseStudy = createVideoFeatureCaseStudy({
  title: "Afriwork Platform",
  eyebrow: "Afriwork / Product Video",
  embedUrl: "https://www.youtube.com/embed/uTn14-AF9ac",
  summary: [
    "Afriwork is an Ethiopian job platform, started in Addis Ababa in 2018, that connects employers with job seekers for local, remote, freelance and full-time work.",
    "A 21-second walkthrough of the platform. It opens on the job listings under the line \"Easy to use UI\", follows a cursor through the job post form, and ends in the applicant view, where a candidate's CV is reviewed and they are shortlisted, all set on a coral gradient that echoes the brand's red.",
  ],
  format: "Product walkthrough, UI motion",
  credits: [
    { label: "Client", value: "Afriwork" },
    { label: "Length", value: "21 seconds" },
    { label: "Year", value: "2025" },
  ],
  stills: [
    ["afriwork-platform/afriwork-platform-01.jpg", "Afriwork Platform video: 'Easy to use UI' above the Discover Jobs screen."],
    ["afriwork-platform/afriwork-platform-02.jpg", "Afriwork Platform video: close-up of the job post form."],
    ["afriwork-platform/afriwork-platform-03.jpg", "Afriwork Platform video: the applicant view with a candidate's profile and CV."],
    ["afriwork-platform/afriwork-platform-04.jpg", "Afriwork Platform video: the Shortlist Messages dialog with Notify and Don't Notify."],
  ],
});

const afriworkAiCaseStudy = createVideoFeatureCaseStudy({
  title: "Afriwork Ai",
  eyebrow: "Afriwork / Product Video",
  embedUrl: "https://www.youtube.com/embed/YBWI6mzGOo8",
  summary: [
    "Afriwork AI builds a job seeker's profile from the CV they upload.",
    "The 15-second video keeps to that one idea. On a dark stage with floating chrome stars, it goes \"Upload your CV\", then \"Drop and go\", and the finished profile appears on a tilted 3D screen and scrolls past.",
  ],
  format: "Product video, 3D motion",
  credits: [
    { label: "Client", value: "Afriwork" },
    { label: "Length", value: "15 seconds" },
    { label: "Year", value: "2025" },
  ],
  stills: [
    ["afriwork-ai/afriwork-ai-01.jpg", "Afriwork AI video: the Afriwork AI logo among floating chrome stars."],
    ["afriwork-ai/afriwork-ai-02.jpg", "Afriwork AI video: 'Upload your CV' with a CV folder icon."],
    ["afriwork-ai/afriwork-ai-03.jpg", "Afriwork AI video: 'Drop and go' under an empty drop zone."],
    ["afriwork-ai/afriwork-ai-04.jpg", "Afriwork AI video: the generated profile on a tilted screen."],
  ],
});

const cayneticVoiceCaseStudy = createVideoFeatureCaseStudy({
  title: "Caynetic Voice - Ad",
  eyebrow: "Caynetic Voice / Ad",
  embedUrl: "https://www.youtube.com/embed/VzV6JjEZrnA",
  summary: [
    "Caynetic Voice answers a business's customer messages for them, even when nobody is free to reply.",
    "The ad is a 29-second before and after. In the dark half, a customer asks to place a rush order and gets no reply: \"Message unanswered. Opportunity lost.\" The light half shows Caynetic Voice logging the order and notifying the owner, then a phone notification, and the line \"Answer every text. Even when you can't.\"",
  ],
  format: "Ad, UI motion",
  credits: [
    { label: "Client", value: "Caynetic Voice" },
    { label: "Length", value: "29 seconds" },
    { label: "Year", value: "2025" },
  ],
  stills: [
    ["caynetic-voice/caynetic-voice-01.jpg", "Caynetic Voice ad: 'Without Caynetic Voice' above a customer asking for a rush order."],
    ["caynetic-voice/caynetic-voice-02.jpg", "Caynetic Voice ad: 'Message unanswered. Opportunity lost.'"],
    ["caynetic-voice/caynetic-voice-03.jpg", "Caynetic Voice ad: the automatic reply logging the order, under 'With Caynetic Voice'."],
    ["caynetic-voice/caynetic-voice-04.jpg", "Caynetic Voice ad: a phone lock screen with a new rush order notification and 'Never miss a customer.'"],
  ],
});

const chapaCaseStudy = createVideoFeatureCaseStudy({
  title: "Chapa",
  eyebrow: "Chapa / Brand Video",
  embedUrl: "https://www.youtube.com/embed/L0bFlOdZjmU",
  summary: [
    "Chapa is an Ethiopian fintech whose payment gateway lets businesses take digital payments and add payment options to their own apps and sites.",
    "\"Seamless Payments, Endless Opportunities\" is a 16-second kinetic-type spot. The message builds word by word on a green gradient, with pill highlights and a cursor picking out the benefits (one integrated platform, lower costs, better efficiency) before it resolves on the logo.",
  ],
  format: "Brand video, kinetic typography",
  credits: [
    { label: "Client", value: "Chapa" },
    { label: "Length", value: "16 seconds" },
    { label: "Year", value: "2025" },
  ],
  stills: [
    ["chapa/chapa-01.jpg", "Chapa video: the line 'With our fully integrated platform' with a cursor on a dark green gradient."],
    ["chapa/chapa-02.jpg", "Chapa video: 'cut costs' with 'costs' in a green pill."],
    ["chapa/chapa-03.jpg", "Chapa video: 'enhance efficiency' on a light green gradient."],
    ["chapa/chapa-04.jpg", "Chapa video: the Chapa logo on the green gradient."],
  ],
});

const hanbonConstructionCaseStudy = createVideoFeatureCaseStudy({
  title: "Hanbon Construction",
  eyebrow: "Hanbon / Brand Video",
  embedUrl: "https://www.youtube.com/watch?v=1UEBQCt7WCk",
  summary: [
    "Hanbon Construction Material P.L.C. supplies interior finishing materials, including SPC flooring, UV board and wall panels.",
    "The 39-second brand video moves through finished rooms (a living room, a meeting room, a marble bathroom, a kitchen) while the copy builds on screen, then introduces each material with its own product card. It closes on the promise of beauty and durability, and the Hanbon logo.",
  ],
  format: "Brand video, interiors and product motion",
  credits: [
    { label: "Client", value: "Hanbon Construction Material P.L.C." },
    { label: "Length", value: "39 seconds" },
    { label: "Year", value: "2026" },
  ],
  stills: [
    ["hanbon/hanbon-01.jpg", "Hanbon video: a sunlit living room with a pink sofa."],
    ["hanbon/hanbon-02.jpg", "Hanbon video: a meeting room with slatted wall panels and the words 'and office'."],
    ["hanbon/hanbon-03.jpg", "Hanbon video: a marble bathroom with a floating vanity."],
    ["hanbon/hanbon-04.jpg", "Hanbon video: a kitchen with a long island and green cabinets."],
    ["hanbon/hanbon-05.jpg", "Hanbon video: the UV board product card."],
    ["hanbon/hanbon-06.jpg", "Hanbon video: the wall panels product card in several colours."],
  ],
});

// Each project's page link, cleaned-up title and colour (used on its page).
// Colours come from the work itself; projects without one use the site orange.
const projectPageMeta = {
  "Show reel - 2025": { slug: "show-reel-2025", displayTitle: "Show reel 2025", accent: "#db2a1d" },
  Chapa: { slug: "chapa", displayTitle: "Chapa", accent: "#6fb52c" },
  "Afriwork Platform": { slug: "afriwork-platform", displayTitle: "Afriwork Platform", accent: "#f06a5a" },
  "Afriwork Ai": { slug: "afriwork-ai", displayTitle: "Afriwork AI", accent: "#3b6fd8" },
  "Caynetic Voice - Ad": { slug: "caynetic-voice", displayTitle: "Caynetic Voice", accent: "#2a6f7e" },
  "Hanbon Construction": { slug: "hanbon-construction", displayTitle: "Hanbon Construction", accent: "#25b865" },
  "Marshall.": { slug: "marshall-action-iii", displayTitle: "Marshall Action III", accent: "#1b1b1b" },
  "Air pods Max": { slug: "airpods-max", displayTitle: "AirPods Max", accent: "#1d1d1f" },
  "Women In Muya": { slug: "women-in-muya", displayTitle: "Women in Muya", accent: "#de6226" },
  "Ttechnos Logo": { slug: "ttechnos", displayTitle: "Ttechnos", accent: "#e5392b" },
  "Lite Innovate": { slug: "lite-innovate", displayTitle: "Lite Innovate" },
  "Halal Catering": { slug: "halal-catering", displayTitle: "Halal Catering" },
  Alenelachu: { slug: "alenelachu", displayTitle: "Alenelachu" },
};

// Listed in priority order: number 01 sits at the front of the folder stack.
const projects = [
  {
    title: "Show reel - 2025",
    source: "Motion design",
    referenceUrl: "https://www.behance.net/gallery/231914735/StudioRass-Show-Reel",
    caseStudy: showReelCaseStudy,
  },
  {
    title: "Chapa",
    source: "Motion design",
    caseStudy: chapaCaseStudy,
  },
  {
    title: "Afriwork Platform",
    source: "Motion design",
    caseStudy: afriworkPlatformCaseStudy,
  },
  {
    title: "Afriwork Ai",
    source: "Motion design",
    caseStudy: afriworkAiCaseStudy,
  },
  {
    title: "Caynetic Voice - Ad",
    source: "Motion design",
    caseStudy: cayneticVoiceCaseStudy,
  },
  {
    title: "Hanbon Construction",
    source: "Motion design",
    referenceUrl: "https://www.youtube.com/watch?v=1UEBQCt7WCk",
    caseStudy: hanbonConstructionCaseStudy,
  },
  {
    title: "Marshall.",
    source: "3D product commercial",
    referenceUrl: "https://www.behance.net/gallery/193789767/MARSHAL-Action-III-Product-Commercial",
    caseStudy: marshallCaseStudy,
  },
  {
    title: "Air pods Max",
    source: "3D product commercial",
    referenceUrl: "https://www.behance.net/gallery/193955523/Air-pods-Max",
    caseStudy: airpodMaxCaseStudy,
  },
  {
    title: "Women In Muya",
    source: "Brand identity",
    referenceUrl: "https://www.behance.net/gallery/209914781/Women-In-Muya",
    caseStudy: womenInMuyaCaseStudy,
  },
  {
    title: "Ttechnos Logo",
    source: "Brand identity",
    referenceUrl: "https://www.behance.net/gallery/210173327/Ttechnos",
    caseStudy: ttechnosCaseStudy,
  },
  {
    title: "Lite Innovate",
    source: "Brand identity",
    referenceUrl: "https://www.behance.net/gallery/210708431/Lite-Innovate-Logo-and-Visual-Identity-Design",
    caseStudy: liteInnovateCaseStudy,
  },
  {
    title: "Halal Catering",
    source: "Brand identity",
    referenceUrl: "https://www.behance.net/gallery/210007661/Halal-Catering-Logo-Design-and-Identity",
    caseStudy: halalCateringCaseStudy,
  },
  {
    title: "Alenelachu",
    source: "Logo design",
    referenceUrl: "https://www.behance.net/gallery/199019247/Alenelachu-Logo-Design",
    caseStudy: alenelachuCaseStudy,
  },
].map((project, index) => {
  const meta = projectPageMeta[project.title] ?? {};
  const resolvedEmbedUrl =
    project.caseStudy
      ? null
      : project.embedUrl ??
        (project.url?.includes("behance.net")
      ? buildBehanceEmbedUrl(project.url)
      : null);

  return {
    id: `project-${index + 1}`,
    order: index + 1,
    portfolioTab: motionProjectTitles.has(project.title) ? "Motion" : "Design",
    group: motionProjectTitles.has(project.title) ? "Motion" : "Design",
    source: project.source ?? (resolvedEmbedUrl ? "Behance project" : "Project folder"),
    slug: meta.slug ?? `project-${index + 1}`,
    displayTitle: meta.displayTitle ?? project.title,
    accent: meta.accent,
    ...project,
    embedUrl: resolvedEmbedUrl,
  };
});

// Desktop folder stack: design folders in front, motion folders (show reel
// included) behind them, with a gap between the two groups.
const folderGroupGap = { x: 34, y: 26 };
const createProjectFolders = (portfolioProjects) => {
  // Front to back: design first, then motion. Numbers count from the front.
  const frontToBack = [
    ...portfolioProjects.filter((project) => project.group !== "Motion"),
    ...portfolioProjects.filter((project) => project.group === "Motion"),
  ].map((project, index) => ({ ...project, stackNumber: index + 1 }));
  const backCount = frontToBack.filter((project) => project.group === "Motion").length;

  // The last folder renders at the front, so render back to front.
  const backToFront = [...frontToBack].reverse();
  return backToFront.map((project, index) => {
    const isBehindGap = index < backCount;
    return {
      ...project,
      className: `folder-${index + 1}`,
      x: (backToFront.length - index - 1) * 14 + (isBehindGap ? folderGroupGap.x : 0),
      y: 48 + index * 10 - (isBehindGap ? folderGroupGap.y : 0),
      rotate: 0,
    };
  });
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const contact = {
  email: "nahusenaygebreamlak@gmail.com",
  links: [
    { label: "Instagram", href: "https://www.instagram.com/rass_nahu/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nahusenay-gebreamlak-a92832230/" },
  ],
};

function ProfileIllustration() {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className="profile-illustration"
      aria-hidden="true"
    >
      <rect width="128" height="128" rx="28" fill="#DDECCE" />
      <path
        d="M36 52C36 27 48 15 64 15C80 15 92 27 92 52V72H36V52Z"
        fill="#5D0C3E"
      />
      <path
        d="M31 59C31 54 35 50 40 50H44V70H40C35 70 31 66 31 61V59Z"
        fill="#9A7675"
        stroke="#5D0C3E"
        strokeWidth="2"
      />
      <path
        d="M84 50H88C93 50 97 54 97 59V61C97 66 93 70 88 70H84V50Z"
        fill="#9A7675"
        stroke="#5D0C3E"
        strokeWidth="2"
      />
      <path
        d="M41 47C41 29 51 20 64 20C77 20 87 29 87 47V75C87 90 77 102 64 102C51 102 41 90 41 75V47Z"
        fill="#9A7675"
        stroke="#5D0C3E"
        strokeWidth="2.5"
      />
      <path
        d="M42 45C43 32 53 24 64 24C75 24 85 32 86 45L77 39L64 38L51 40L42 45Z"
        fill="#5D0C3E"
      />
      <path
        d="M43 102L64 90L85 102V125H43V102Z"
        fill="#DB552F"
        stroke="#5D0C3E"
        strokeWidth="2.5"
      />
      <path
        d="M33 110L54 98L64 106L74 98L95 110V128H33V110Z"
        fill="#DB552F"
        stroke="#5D0C3E"
        strokeWidth="2.5"
      />
      <path
        d="M49 57C53 51 61 51 66 56"
        stroke="#5D0C3E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M62 69C64 65 68 64 70 67C72 69 71 73 67 76"
        stroke="#5D0C3E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 73C55 77 61 78 65 75"
        stroke="#5D0C3E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M46 63H58"
        stroke="#F5F8E7"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M70 63H82"
        stroke="#F5F8E7"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="56" cy="63" r="2" fill="#5D0C3E" />
      <circle cx="78" cy="63" r="2" fill="#5D0C3E" />
    </svg>
  );
}

function ProfileAvatar() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return <ProfileIllustration />;
  }

  return (
    <img
      src={profileImageCandidates[candidateIndex]}
      alt="Nahu Gebreamlak portrait"
      className="profile-photo"
      loading="eager"
      onError={() => {
        if (candidateIndex < profileImageCandidates.length - 1) {
          setCandidateIndex((current) => current + 1);
          return;
        }

        setUseFallback(true);
      }}
    />
  );
}

function getCurrentClockLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function FolderSvg() {
  return (
    <svg
      width="598"
      height="712"
      viewBox="0 0 598 712"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="folder-svg"
    >
      <path
        d="M12 45.939V571.568C12 579.076 17.2203 585.574 24.5518 587.192L577.052 709.13C587.038 711.334 596.5 703.732 596.5 693.506V169.555C596.5 162.148 591.416 155.71 584.211 153.992L294.288 84.8526C287.084 83.1345 282 76.6959 282 69.289V48.2076C282 40.5052 276.512 33.8959 268.941 32.4802L104.723 1.77268C100.138 0.915348 95.407 2.1014 91.7689 5.02035L60.3261 30.2477C56.6333 33.2105 51.818 34.3857 47.1755 33.4572L31.1379 30.2497C21.2372 28.2696 12 35.8422 12 45.939Z"
        fill="#111111"
        stroke="black"
        strokeWidth="3"
      />
      <path
        d="M1.5 45.939V571.568C1.5 579.076 6.72032 585.574 14.0518 587.192L566.552 709.13C576.538 711.334 586 703.732 586 693.506V169.555C586 162.148 580.916 155.71 573.711 153.992L283.788 84.8526C276.584 83.1345 271.5 76.6959 271.5 69.289V48.2076C271.5 40.5052 266.012 33.8959 258.441 32.4802L94.2226 1.77268C89.6377 0.915348 84.907 2.1014 81.2689 5.02035L49.8261 30.2477C46.1333 33.2105 41.318 34.3857 36.6755 33.4572L20.6379 30.2497C10.7372 28.2696 1.5 35.8422 1.5 45.939Z"
        fill="#f6f0e3"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
}

function CustomYouTubePlayer({ src, title, className = "" }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoId = getYouTubeVideoId(src);

  useEffect(() => {
    if (!videoId || !containerRef.current) {
      return undefined;
    }

    let mounted = true;

    loadYouTubeApi().then((YT) => {
      if (!mounted || !YT?.Player || !containerRef.current) {
        return;
      }

      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
            if (!mounted) {
              return;
            }
            setIsReady(true);
            setIsMuted(true);
            setDuration(event.target.getDuration?.() ?? 0);
          },
        },
      });
    });

    return () => {
      mounted = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) {
        return;
      }

      const nextDuration = player.getDuration?.() ?? 0;
      const nextTime = player.getCurrentTime?.() ?? 0;
      setDuration(nextDuration);
      setCurrentTime(nextTime);
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReady]);

  const handleSeek = (event) => {
    const player = playerRef.current;
    if (!player || !duration) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const nextTime = ratio * duration;
    player.seekTo(nextTime, true);
    setCurrentTime(nextTime);
  };

  const handleToggleMute = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className={`custom-youtube-player ${className}`.trim()}>
      <div ref={containerRef} className="custom-youtube-player__embed" />
      <button
        type="button"
        className="custom-youtube-player__progress"
        onClick={handleSeek}
        aria-label={`Seek ${title}`}
      >
        <span
          className="custom-youtube-player__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </button>
      <div className="custom-youtube-player__controls" aria-hidden={!isReady}>
        <button
          type="button"
          className="custom-youtube-player__control"
          onClick={handleToggleMute}
          aria-label={isMuted ? `Unmute ${title}` : `Mute ${title}`}
        >
          {isMuted ? (
            <svg viewBox="0 0 51 51" aria-hidden="true">
              <circle cx="25.0298" cy="25.0298" r="25.0298" fill="#F6F6F6" />
              <path d="M11.4004 25.4475L11.4004 20.6272C11.4004 19.8846 12.0024 19.2826 12.7451 19.2826L17.553 19.2826C17.861 19.2826 18.1596 19.1769 18.399 18.9831L22.9395 15.3082C23.8187 14.5966 25.1301 15.2223 25.1301 16.3534L25.1301 33.7067C25.1301 34.8377 23.8187 35.4635 22.9395 34.7519L18.399 31.0769C18.1596 30.8832 17.861 30.7775 17.553 30.7775L12.7451 30.7775C12.0024 30.7775 11.4004 30.1754 11.4004 29.4328L11.4004 25.4475Z" />
              <path d="M31.1309 21.2656L38.6591 28.794" />
              <path d="M38.6602 21.2656L31.1317 28.7938" />
            </svg>
          ) : (
            <svg viewBox="0 0 51 51" aria-hidden="true">
              <circle cx="25.0298" cy="25.0298" r="25.0298" fill="#F6F6F6" />
              <path d="M11.4004 25.4475L11.4004 20.6272C11.4004 19.8846 12.0024 19.2826 12.7451 19.2826L17.553 19.2826C17.861 19.2826 18.1596 19.1769 18.399 18.9831L22.9395 15.3082C23.8187 14.5966 25.1301 15.2223 25.1301 16.3534L25.1301 33.7067C25.1301 34.8377 23.8187 35.4635 22.9395 34.7519L18.399 31.0769C18.1596 30.8832 17.861 30.7775 17.553 30.7775L12.7451 30.7775C12.0024 30.7775 11.4004 30.1754 11.4004 29.4328L11.4004 25.4475Z" />
              <path d="M30.1709 20.3242C31.8232 21.5642 32.8493 23.5377 32.8493 25.6642C32.8493 27.7908 31.8232 29.7643 30.1709 31.0042" />
              <path d="M33.8281 16.7617C36.423 18.9091 37.95 22.1018 37.95 25.6642C37.95 29.2266 36.423 32.4193 33.8281 34.5667" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

const PHONE_QUERY = "(max-width: 720px)";

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const handleChange = (event) => setIsPhone(event.matches);
    setIsPhone(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return isPhone;
}

const getProjectCover = (project) => {
  const firstMedia = project.caseStudy?.sections?.[0]?.media?.[0];
  if (!firstMedia) {
    return null;
  }

  if (firstMedia.type === "video") {
    const videoId = firstMedia.videoId ?? getYouTubeVideoId(firstMedia.embedUrl);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  }

  return firstMedia.src ?? null;
};

const projectGroups = [
  {
    id: "Motion",
    projects: projects.filter((project) => motionProjectTitles.has(project.title)),
  },
  {
    id: "Design",
    projects: projects.filter((project) => !motionProjectTitles.has(project.title)),
  },
];

function PhoneProjectList({ activeGroupId, onSelectGroup, onOpenProject }) {
  const activeGroup =
    projectGroups.find((group) => group.id === activeGroupId) ?? projectGroups[0];

  return (
    <div className="phone-projects">
      <div className="phone-projects__switch" role="group" aria-label="Project type">
        {projectGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={group.id === activeGroup.id ? "is-active" : undefined}
            aria-pressed={group.id === activeGroup.id}
            onClick={() => onSelectGroup(group.id)}
          >
            {group.id} · {group.projects.length}
          </button>
        ))}
      </div>

      <ul className="phone-projects__list" aria-label={`${activeGroup.id} projects`}>
        {activeGroup.projects.map((project, index) => {
          const cover = getProjectCover(project);
          const isVideo = motionProjectTitles.has(project.title);

          return (
            <li key={project.id}>
              <button
                type="button"
                className="phone-folder"
                onClick={() => onOpenProject(project)}
                aria-label={`Open ${project.title}`}
              >
                <span className="phone-folder__tab" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="phone-folder__body">
                  <span className="phone-folder__cover">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    {isVideo ? (
                      <span className="phone-folder__play" aria-hidden="true">
                        <svg viewBox="0 0 18 18" width="18" height="18">
                          <path d="M6 4l8 5-8 5V4z" fill="currentColor" />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                  <span className="phone-folder__meta">
                    <span className="phone-folder__copy">
                      <span className="phone-folder__title">{project.title}</span>
                      <span className="phone-folder__category">{project.source}</span>
                    </span>
                    <span className="phone-folder__arrow" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                        <path
                          d="M4 8h8M8.5 4.5L12 8l-3.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  const [activePortfolioTab, setActivePortfolioTab] = useState("Projects");
  const [phoneGroupId, setPhoneGroupId] = useState("Motion");
  const isPhone = useIsPhone();
  const [isFolderStackInteractive, setIsFolderStackInteractive] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [path, setPath] = useState(() => window.location.pathname);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const openContact = (event) => {
    event?.preventDefault();
    setIsContactOpen(true);
  };
  const contactDialog = (
    <ContactDialog open={isContactOpen} onClose={() => setIsContactOpen(false)} email={contact.email} />
  );
  const [expandedCareerIndex, setExpandedCareerIndex] = useState(null);
  const [currentClock, setCurrentClock] = useState(() => new Date());
  const timePanelRef = useRef(null);
  const folderOriginRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (isTimeOpen && !timePanelRef.current?.contains(event.target)) {
        setIsTimeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isTimeOpen]);

  useEffect(() => {
    const updateClock = () => {
      setCurrentClock(new Date());
    };

    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(window.location.pathname);
    window.scrollTo(0, 0);
  };

  const openProject = (project) => {
    setHoveredProjectId(null);
    navigate(`/projects/${project.slug}`);
  };

  const handleToggleTimePill = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsTimeOpen((current) => !current);
  };

  const currentClockLabel = getCurrentClockLabel(currentClock);
  const minuteAngle = currentClock.getMinutes() * 6 + currentClock.getSeconds() * 0.1;
  const hourAngle =
    ((currentClock.getHours() % 12) + currentClock.getMinutes() / 60) * 30;
  const projectFolders = createProjectFolders(projects);

  useEffect(() => {
    setIsFolderStackInteractive(false);

    const timer = window.setTimeout(() => {
      setIsFolderStackInteractive(true);
    }, 520 + Math.max(projectFolders.length - 1, 0) * 45);

    return () => window.clearTimeout(timer);
  }, [projectFolders.length]);

  const handlePortfolioTabSelect = (nextTab) => {
    if (nextTab === activePortfolioTab) {
      return;
    }

    setActivePortfolioTab(nextTab);
    setHoveredProjectId(null);
    setExpandedCareerIndex(null);
  };

  const getProjectFromPointer = (event) => {
    const origin = folderOriginRef.current;
    if (!origin) {
      return null;
    }

    const rect = origin.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const renderedWidth = rect.width;
    const renderedHeight = renderedWidth * (712 / 598);
    const baseTop = rect.height - renderedHeight;

    const tabAnchors = projectFolders.map((project) => ({
      project,
      x: project.x + renderedWidth * 0.17,
      y: baseTop + project.y + renderedHeight * 0.05,
    }));

    for (const anchor of [...tabAnchors].reverse()) {
      const dx = localX - anchor.x;
      const dy = localY - anchor.y;

      const insideStrip =
        dx >= -18 &&
        dx <= renderedWidth * 0.54 &&
        dy >= -16 &&
        dy <= 22 &&
        dy >= dx * 0.055 - 18 &&
        dy <= dx * 0.055 + 16;

      if (insideStrip) {
        return anchor.project;
      }
    }

    return null;
  };

  const handleFolderHoverMove = (event) => {
    if (!isFolderStackInteractive) {
      setIsFolderStackInteractive(true);
    }

    const activeProject = getProjectFromPointer(event);
    setHoveredProjectId(activeProject?.id ?? null);
  };

  const handleFolderClick = (event) => {
    if (!isFolderStackInteractive) {
      setIsFolderStackInteractive(true);
    }

    const activeProject = getProjectFromPointer(event);
    if (!activeProject) {
      return;
    }

    openProject(activeProject);
  };

  const activePreviewProject =
    projectFolders.find((project) => project.id === hoveredProjectId) ??
    projectFolders[projectFolders.length - 1];
  const isFunStuffTab = activePortfolioTab === "Fun stuff I made";
  const isCareerTab = activePortfolioTab === "Career";

  const routeSlug = path.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  const routeIndex = projects.findIndex((project) => project.slug === routeSlug);
  if (routeIndex !== -1) {
    return (
      <>
      <ProjectPage
        key={projects[routeIndex].slug}
        project={projects[routeIndex]}
        nextProject={projects[(routeIndex + 1) % projects.length]}
        contact={contact}
        onOpenContact={openContact}
        onNavigate={navigate}
        onOpenCareer={() => {
          setActivePortfolioTab("Career");
          navigate("/");
        }}
      />
      {contactDialog}
      </>
    );
  }

  return (
    <main className="page-shell">
      <motion.section id="career" className="masthead" initial="hidden" animate="show">
        <div className="masthead-row">
          <motion.div className="profile-stack" variants={reveal} custom={0.05}>
            <div className="profile-chip" aria-label="Profile">
              <ProfileAvatar />
            </div>
          </motion.div>

          <MusicPlayer />

          <motion.div
            className={`time-stack ${isTimeOpen ? "is-open" : ""}`}
            variants={reveal}
            custom={0.18}
            ref={timePanelRef}
          >
            <motion.button
              type="button"
              className={`time-pill ${isTimeOpen ? "is-open" : ""}`}
              initial={false}
              animate={{
                width: isTimeOpen ? 214 : 68,
                height: isTimeOpen ? 286 : 42,
                borderRadius: isTimeOpen ? 107 : 999,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 28,
              }}
              onClick={handleToggleTimePill}
              aria-label={isTimeOpen ? "Close time panel" : "Open time panel"}
              aria-expanded={isTimeOpen}
              whileTap={{ scale: 0.97 }}
            >
              <motion.img
                className="time-pill__art"
                src="/assets/time-pill-open.svg?v=2"
                alt=""
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: isTimeOpen ? 1 : 0,
                  scale: isTimeOpen ? 1 : 0.84,
                }}
                transition={{
                  duration: isTimeOpen ? 0.24 : 0.14,
                  delay: isTimeOpen ? 0.08 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <svg
                className="time-pill__dial"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <line
                  className="time-pill__hand time-pill__hand--hour"
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="28"
                  transform={`rotate(${hourAngle} 50 50)`}
                />
                <line
                  className="time-pill__hand time-pill__hand--minute"
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="16"
                  transform={`rotate(${minuteAngle} 50 50)`}
                />
                <circle className="time-pill__pivot" cx="50" cy="50" r="2.6" />
              </svg>

              <span className="time-pill__clock">{currentClockLabel}</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="profile-copy" variants={reveal} custom={0.15}>
          <p className="profile-name">Nahu Gebreamlak</p>
          <p className="profile-role">Graphic &amp; motion designer</p>
        </motion.div>

        <motion.div className="masthead-navrow" variants={reveal} custom={0.24}>
          <nav className="masthead-links" aria-label="Portfolio categories">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#showcase"
                className={link === activePortfolioTab ? "active" : undefined}
                onClick={() => handlePortfolioTabSelect(link)}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="masthead-right">
            <button
              type="button"
              className={`masthead-right-link ${isCareerTab ? "active" : ""}`}
              onClick={() => handlePortfolioTabSelect("Career")}
            >
              Career
            </button>
            <a className="masthead-contact" href={`mailto:${contact.email}`} onClick={openContact}>
              Get in touch
            </a>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="showcase"
        className={`showcase-card ${isFunStuffTab ? "showcase-card--fun" : ""} ${
          isCareerTab ? "showcase-card--career" : ""
        } ${isPhone && !isCareerTab && !isFunStuffTab ? "showcase-card--phone-list" : ""}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {isCareerTab ? (
          <div className="career-panel">
            <motion.section
              className="career-intro"
              aria-label="About me"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="career-intro__eyebrow">{careerProfile.eyebrow}</p>
              <div className="career-intro__headline">
                <p className="career-intro__lead">{careerProfile.intro}</p>
              </div>
              <div className="career-intro__body">
                {careerProfile.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="career-intro__skills" aria-label="Top skills">
                {careerProfile.skills.map((skill) => (
                  <span key={skill.label} className="career-intro__skill">
                    {skill.label}
                  </span>
                ))}
              </div>
            </motion.section>

            <div className="career-list" aria-label="Career history">
            {careerEntries.map((entry, index) => (
              <motion.div
                key={`${entry.role}-${entry.company}-${index}`}
                className={`career-list__row ${
                  expandedCareerIndex === index ? "is-open" : ""
                }`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.42,
                  delay: 0.06 + index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
                  type="button"
                  className="career-list__trigger"
                  onClick={() =>
                    setExpandedCareerIndex((current) => (current === index ? null : index))
                  }
                  aria-expanded={expandedCareerIndex === index}
                >
                  <p className="career-list__role">{entry.role}</p>
                  <div className="career-list__company-wrap">
                    <p className="career-list__company">{entry.company}</p>
                    <span className="career-list__chevron" aria-hidden="true" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedCareerIndex === index ? (
                    <motion.div
                      className="career-list__details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="career-list__details-inner">
                        <p className="career-list__summary">
                          {careerSummaryLabel}
                        </p>
                        <p className="career-list__description">{entry.description}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ))}
            </div>
          </div>
        ) : isFunStuffTab ? (
          <motion.section
            className="fun-coming-soon"
            aria-labelledby="fun-stuff-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="fun-coming-soon__copy">
              <p className="fun-coming-soon__eyebrow">{funStuffPanel.eyebrow}</p>
              <h2 id="fun-stuff-title" className="fun-coming-soon__title">
                {funStuffPanel.title}
              </h2>
              <p className="fun-coming-soon__subtitle">{funStuffPanel.subtitle}</p>
              <p className="fun-coming-soon__note">{funStuffPanel.note}</p>
            </div>

            <div className="fun-coming-soon__board" aria-hidden="true">
              <img className="fun-coming-soon__art" src={funStuffPanel.artwork} alt="" />
            </div>
          </motion.section>
        ) : isPhone ? (
          <PhoneProjectList
            activeGroupId={phoneGroupId}
            onSelectGroup={setPhoneGroupId}
            onOpenProject={openProject}
          />
        ) : (
          <>
            <div className="showcase-copy">
              <p className="showcase-eyebrow">Selected Projects</p>
              <div className="showcase-copy__row">
                <div>
                  <p className={`showcase-highlight ${hoveredProjectId ? "is-hovered" : ""}`}>
                    {activePreviewProject.title}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="folder-scene"
              aria-label="Project folders"
            >
              <div
                className="folder-origin"
                ref={folderOriginRef}
                onPointerMove={handleFolderHoverMove}
                onPointerLeave={() => setHoveredProjectId(null)}
                onClick={handleFolderClick}
              >
                {projectFolders.map((project, index) => {
                  const isHovered = hoveredProjectId === project.id;
                  const isMuted = hoveredProjectId && !isHovered;
                  const liftDistance = isHovered ? 34 : 0;
                  const liftedY = project.y - liftDistance;
                  const entranceDelay = (projectFolders.length - index - 1) * 0.045;
                  const motionDelay = isFolderStackInteractive ? 0 : entranceDelay;

                  return (
                    <motion.div
                      key={project.id}
                      className={`folder-stack ${project.className}`}
                      initial={{ x: project.x + 12, y: project.y + 18, rotate: 0 }}
                      animate={{
                        x: project.x,
                        y: liftedY,
                        rotate: project.rotate,
                      }}
                      transition={{
                        x: {
                          type: "spring",
                          delay: motionDelay,
                          stiffness: 520,
                          damping: 32,
                        },
                        y: {
                          type: "spring",
                          delay: motionDelay,
                          stiffness: 540,
                          damping: 30,
                        },
                        rotate: {
                          type: "spring",
                          delay: motionDelay,
                          stiffness: 520,
                          damping: 32,
                        },
                      }}
                    >
                      <button
                        type="button"
                        className={`folder-tab-button ${isHovered ? "is-hovered" : ""} ${
                          isMuted ? "is-muted" : ""
                        }`}
                        onFocus={() => {
                          setIsFolderStackInteractive(true);
                          setHoveredProjectId(project.id);
                        }}
                        onBlur={() =>
                          setHoveredProjectId((current) =>
                            current === project.id ? null : current,
                          )
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          openProject(project);
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <span className="folder-tab-button__index">
                          {String(project.stackNumber).padStart(2, "0")}
                        </span>
                        <span className="folder-tab-button__title">{project.title}</span>
                      </button>
                      <FolderSvg />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </motion.section>

      <footer id="contact" className="site-footer">
        <div className="site-footer__cta">
          <p className="site-footer__eyebrow">Get in touch</p>
          <p className="site-footer__lead">Have a project in mind?</p>
          <a className="site-footer__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>
        <ul className="site-footer__links" aria-label="Social links">
          {contact.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
      {contactDialog}
    </main>
  );
}

export default App;
