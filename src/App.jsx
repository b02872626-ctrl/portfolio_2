import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = ["Projects", "Fun stuff I made"];
const emojiAssets = {
  monocle: encodeURI("/assets/emojies/Face with monocle.gif"),
  grin: encodeURI("/assets/emojies/Grinning face.gif"),
  hundred: encodeURI("/assets/emojies/Hundred points.gif"),
  sunglasses: encodeURI("/assets/emojies/Smiling face with sunglasses.gif"),
  star: encodeURI("/assets/emojies/Star-struck.gif"),
};
const careerEntries = [
  {
    role: "Senior Graphic Designer",
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
    { label: "Motion Designer", icon: emojiAssets.star },
    { label: "Graphic Designer", icon: emojiAssets.monocle },
    { label: "3D Artist", icon: emojiAssets.sunglasses },
  ],
  accents: [emojiAssets.grin, emojiAssets.hundred],
};
const funStuffFeed = {
  title: "Fun stuff I made",
  subtitle: "Loose drops, experiments, behind-the-scenes frames, and whatever else deserves a spot on the timeline.",
  profileName: "Nahu Gebreamlak",
  handle: "@nahu",
};
const funStuffPosts = [
  {
    id: "fun-post-01",
    mood: emojiAssets.grin,
    timestamp: "Now",
    caption:
      "Building this tab out as a running feed instead of a static wall so sketches, weird tests, and small visual moments can all live in one place.",
  },
  {
    id: "fun-post-02",
    mood: emojiAssets.star,
    timestamp: "Soon",
    caption:
      "First image drop goes here. Once the assets land in the folder and you send the caption, this card is ready to turn into a proper post.",
    media: {
      type: "placeholder",
      label: "Image slot 01",
    },
  },
  {
    id: "fun-post-03",
    mood: emojiAssets.hundred,
    timestamp: "Soon",
    caption:
      "This second slot is ready for process frames, reference images, or anything that feels too casual for the main portfolio but still worth sharing.",
    media: {
      type: "placeholder",
      label: "Image slot 02",
    },
  },
];
const motionProjectTitles = new Set([
  "Women In Muya",
  "Air pods Max",
  "Marshall.",
  "Show reel - 2025",
  "Afriwork Platform",
  "Afriwork Ai",
  "Caynetic Voice - Ad",
  "Chapa",
]);
const profileImageCandidates = [
  "/assets/profile_jpeg.jpeg",
  "/assets/profile_jpeg.jpg",
  "/assets/profile_jpeg.png",
];
const musicTracks = [
  {
    title: "Afer Yemegneshal",
    artist: "Local playlist",
    src: "/assets/music/Afer-yemegneshal.m4a",
  },
  {
    title: "Fetsum Denq Ledj Nesh",
    artist: "Local playlist",
    src: "/assets/music/Fetsum-denq-ledj-nesh.m4a",
  },
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
  detail,
  imageUrls,
  credit,
}) => {
  const images = imageUrls.map((src, index) => ({
    src,
    alt: `${title} Behance presentation image ${String(index + 1).padStart(2, "0")}.`,
    className: index === 0 ? "project-case-study__media--hero" : undefined,
  }));

  const [heroImage, ...galleryImages] = images;
  const gallerySections = chunkItems(galleryImages, 6).map((chunk, chunkIndex) => ({
    label: chunkIndex === 0 ? "Project Gallery" : `Gallery ${chunkIndex + 1}`,
    body: [
      chunkIndex === 0
        ? detail
        : `This section continues the original Behance presentation for ${title}, keeping the remaining frames available on-site in the same flow.`,
    ],
    media: balanceGalleryChunk(chunk, chunkIndex),
  }));

  return {
    eyebrow,
    sections: [
      {
        label: "Overview",
        body: [
          summary,
          `This native gallery adapts the public Behance presentation for ${title} into the portfolio site so the project can be viewed directly here.`,
        ],
        media: heroImage ? [heroImage] : [],
      },
      ...gallerySections,
    ],
    credits: [
      { label: "Project", value: title },
      { label: "Format", value: format },
      { label: "Frames", value: `${imageUrls.length} Behance images` },
    ],
    credit: credit ?? "This on-site version is adapted from the public Behance presentation.",
  };
};

const createBehanceMediaItems = (title, imageUrls) =>
  imageUrls.map((src, index) => ({
    src,
    alt: `${title} Behance presentation image ${String(index + 1).padStart(2, "0")}.`,
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

const createVideoFeatureCaseStudy = ({ title, eyebrow, embedUrl, summary, format }) => ({
  eyebrow,
  sections: [
    {
      label: "Overview",
      body: [summary],
      media: [createVideoMediaItem(title, embedUrl)],
      showCredits: false,
    },
  ],
  credits: [
    { label: "Project", value: title },
    { label: "Format", value: format },
    { label: "Studio", value: "StudioRass" },
  ],
  credit: "This on-site version centers the StudioRass video directly inside the portfolio.",
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
    alt: "Ttechnos Behance presentation hero image.",
    className: "project-case-study__media--hero",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/7fd258210173327.670d03552682b.png",
    alt: "Ttechnos Behance presentation image showing a light logo lockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/edabb9210173327.670d035526d61.png",
    alt: "Ttechnos Behance presentation image showing a red logo lockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/83fae3210173327.670d03552b00e.png",
    alt: "Ttechnos Behance presentation image showing mark construction details.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5ad38f210173327.670d03552b8ad.png",
    alt: "Ttechnos Behance presentation typography board one.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/6c103d210173327.670d03552913f.png",
    alt: "Ttechnos Behance presentation typography board two.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/41df8d210173327.670d035527dd6.png",
    alt: "Ttechnos Behance presentation color palette board.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e10298210173327.670d0355274de.png",
    alt: "Ttechnos Behance presentation gradient study.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/aa8b75210173327.670d035527960.png",
    alt: "Ttechnos Behance presentation application poster.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c9123210173327.670d03552852f.png",
    alt: "Ttechnos Behance presentation applications collage.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c9644e210173327.670d03552c8e1.png",
    alt: "Ttechnos Behance presentation billboard mockup.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/27ea3a210173327.670d03552cd95.png",
    alt: "Ttechnos Behance presentation image 12.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/969c88210173327.670d0355295b3.png",
    alt: "Ttechnos Behance presentation image 13.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2bae84210173327.670d03552a631.png",
    alt: "Ttechnos Behance presentation image 14.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c4116210173327.670d03552a190.png",
    alt: "Ttechnos Behance presentation image 15.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8e04ff210173327.670d03552dbbd.png",
    alt: "Ttechnos Behance presentation image 16.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/14520d210173327.670d03552c00b.png",
    alt: "Ttechnos Behance presentation image 17.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ec3b14210173327.670d03552ab2e.png",
    alt: "Ttechnos Behance presentation image 18.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/5cddab210173327.670d03552d49f.png",
    alt: "Ttechnos Behance presentation image 19.",
    className: "project-case-study__media--wide",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3c5adf210173327.670d035529a13.png",
    alt: "Ttechnos Behance presentation image 20.",
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
      body: [
        "The Behance presentation continues beyond the core boards into additional brand moments, supporting frames, and more expressive rollout pieces.",
        "Showing those extra images here keeps the on-site case study closer to the breadth of the original Behance project rather than compressing it into a shorter edit.",
      ],
      media: ttechnosBehanceImages.slice(11, 15),
    },
    {
      label: "Extended System",
      body: [
        "The final sequence pushes the identity across even more branded touchpoints, demonstrating how consistently the system holds together as the presentation expands.",
        "Using the full Behance image set here preserves the wider visual story from the original project and gives the website version the same fuller arc.",
      ],
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
  credit:
    "This on-site version is adapted from the public Behance presentation by Studio Rass, Nahusenay Gebreamlak, Natnael Getinet, and Aklog Tefera.",
};

const halalCateringCaseStudy = createBehanceGalleryCaseStudy({
  title: "Halal Catering",
  eyebrow: "Halal Catering / Logo Design and Identity",
  format: "Logo Design, Brand Identity",
  summary:
    "Halal Catering is presented as a logo design and identity system with a strong focus on brand presence, structured presentation boards, and applied rollout pieces.",
  detail:
    "The Behance sequence walks through the core mark, supporting identity language, and a broad set of branded applications that extend the concept into real-world touchpoints.",
  imageUrls: behanceProjectImageSets.halalCatering,
});

const womenInMuyaCaseStudy = createBehanceGalleryCaseStudy({
  title: "Women In Muya",
  eyebrow: "Women In Muya / Brand Presentation",
  format: "Brand Identity, Visual Storytelling",
  summary:
    "Women In Muya is presented as a brand-led visual story, using a rich image sequence to show the identity, styling, and supporting applications across the project.",
  detail:
    "This gallery keeps the original Behance progression on-site, moving through the core mark, supporting layouts, and the broader brand rollout.",
  imageUrls: behanceProjectImageSets.womenInMuya,
});

const liteInnovateCaseStudy = createBehanceGalleryCaseStudy({
  title: "Lite Innovate",
  eyebrow: "Lite Innovate / Logo and Visual Identity",
  format: "Logo Design, Visual Identity",
  summary:
    "Lite Innovate unfolds as a full identity presentation, moving from the core mark into rollout frames, supporting layouts, and a much broader brand system across the Behance sequence.",
  detail:
    "This native version now carries the complete Behance image run so the logo direction, supporting graphics, and applications can be viewed in the same full progression.",
  imageUrls: behanceProjectImageSets.liteInnovate,
});

const alenelachuCaseStudy = createBehanceGalleryCaseStudy({
  title: "Alenelachu",
  eyebrow: "Alenelachu / Logo Design",
  format: "Logo Design, Identity Presentation",
  summary:
    "Alenelachu is structured as an identity presentation that develops the mark across multiple branded frames and supporting applications.",
  detail:
    "The Behance sequence moves through the logo exploration, brand system, and additional rollout visuals to show how the identity behaves across formats.",
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
        "Air pods Max is framed here as a StudioRass spec piece built around the product's clean industrial design and premium simplicity. The presentation treats the headphones as an object worth reimagining, with the direction leaning into precision, restraint, and surface quality.",
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
        "One of the key questions in the Behance boards is how to show the power of Air pods Max while staying faithful to its minimalist character. That tension shaped the motion language, the framing, and the overall pacing of the visuals.",
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
        "The story then moves into the making of the piece, with a strong focus on 3D modeling and texturing. The cleaner surfaces, mesh, and hardware details are treated as the core storytelling tools rather than background decoration.",
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
        "The later boards expand the direction into supporting applications, including colorway-led visuals, product stills, and social-style campaign frames. These images show how the same product language can stretch across multiple placements without losing consistency.",
        "By the end of the sequence, the project reads as both a passion-led exercise and a proof of craft for StudioRass, turning a speculative commercial into a convincing product campaign study.",
      ],
      media: balanceGalleryChunk(airpodMaxMedia.slice(5), 2),
    },
  ],
  credits: [
    { label: "Project", value: "Air pods Max" },
    { label: "Format", value: "Spec Product Commercial" },
    { label: "Studio", value: "StudioRass" },
    { label: "Frames", value: `${airpodMaxMedia.length} Behance images` },
  ],
  credit:
    "Copy for this on-site version is adapted from the text panels inside the public Behance presentation.",
};

const marshallMedia = createBehanceMediaItems("Marshall.", behanceProjectImageSets.marshall)
  .filter((_, index) => ![0, 4, 8, 12, 14, 16].includes(index));

const marshallCaseStudy = {
  eyebrow: "Marshall. / Action III Product Commercial",
  sections: [
    {
      label: "Overview",
      body: [
        "Marshall. is introduced as a spec commercial built around the idea of new sound with old soul. From the start, the project treats the speaker as an object with weight, texture, and attitude rather than smoothing it into a generic tech ad.",
        "That positioning gives the whole presentation a clear identity and sets up the rest of the Behance sequence as a product story rooted in character, not just polish.",
      ],
      media: [createVideoMediaItem("Marshall.", "https://www.youtube.com/embed/zLti1JwgfXE")],
    },
    {
      label: "The Vision",
      body: [
        "The vision boards make it clear that the direction was never meant to mimic the ultra-clean language common in contemporary product commercials. Instead, the goal was to push toward something warmer, grittier, and more aligned with Marshall's classic presence.",
        "That choice gives the project its energy, letting the frames feel musical and tactile instead of overly sterile or trend-driven.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(1, 5), 0),
    },
    {
      label: "The Process",
      body: [
        "The process section points back to a detailed 3D model, rich textures, and warm lighting as the foundation of the final look. Those choices keep the product feeling physical and familiar even when the presentation becomes more graphic and campaign-led.",
        "Across the renders, the vintage cues are preserved on purpose, so the speaker stays recognizably Marshall while still reading clearly inside a modern commercial system.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(5, 9), 1),
    },
    {
      label: "The Challenge",
      body: [
        "A major challenge in the text boards is the contrast between Marshall's retro-inspired design and the minimalist, high-gloss product language audiences usually associate with brands like Apple or Samsung. The project leans into that contrast instead of hiding it.",
        "By embracing the speaker's texture, warmth, and heritage, the commercial turns difference into its main strength and gives the work a much more memorable point of view.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(9, 12), 2),
    },
    {
      label: "The Result",
      body: [
        "The closing sequence presents the work as a bold retro revival, with frames that feel ready for billboards, commercials, and social placements. The campaign boards show how the same visual direction can scale without losing the product's timeless edge.",
        "Taken together, the presentation lands as a complete spec campaign: confident in its references, strong in execution, and clearly shaped around Marshall's own design DNA.",
      ],
      media: balanceGalleryChunk(marshallMedia.slice(12), 3),
    },
  ],
  credits: [
    { label: "Project", value: "Marshall." },
    { label: "Format", value: "Spec Product Commercial" },
    { label: "Studio", value: "StudioRass" },
    { label: "Frames", value: `${marshallMedia.length} Behance images` },
  ],
  credit:
    "Copy for this on-site version is adapted from the text panels inside the public Behance presentation.",
};

const showReelCaseStudy = createVideoFeatureCaseStudy({
  title: "Show reel - 2025",
  eyebrow: "StudioRass / Show reel - 2025",
  embedUrl: "https://www.youtube.com/embed/DUNPRyTdXM0",
  summary:
    "Show reel - 2025 opens with the StudioRass video and uses the same compact editorial layout as the rest of the motion pieces, with the video leading on the left and the project note on the right.",
  format: "Show Reel, Motion Showcase",
});

const afriworkPlatformCaseStudy = createVideoFeatureCaseStudy({
  title: "Afriwork Platform",
  eyebrow: "StudioRass / Afriwork Platform",
  embedUrl: "https://www.youtube.com/embed/uTn14-AF9ac",
  summary:
    "Afriwork Platform opens with the StudioRass video and introduces the product through a clean, motion-led platform story that keeps the presentation compact and direct.",
  format: "Platform Video, Product Motion",
});

const afriworkAiCaseStudy = createVideoFeatureCaseStudy({
  title: "Afriwork Ai",
  eyebrow: "StudioRass / Afriwork Ai",
  embedUrl: "https://www.youtube.com/embed/YBWI6mzGOo8",
  summary:
    "Afriwork Ai opens with the StudioRass video and frames the project as a concise AI-led product presentation, using motion to introduce the concept quickly and clearly.",
  format: "AI Product Video, Motion Design",
});

const cayneticVoiceCaseStudy = createVideoFeatureCaseStudy({
  title: "Caynetic Voice - Ad",
  eyebrow: "StudioRass / Caynetic Voice - Ad",
  embedUrl: "https://www.youtube.com/embed/VzV6JjEZrnA",
  summary:
    "Caynetic Voice - Ad opens with the StudioRass video and presents the concept as a focused ad treatment, keeping the storytelling short, sharp, and voice-led.",
  format: "Ad Film, Motion Design",
});

const chapaCaseStudy = createVideoFeatureCaseStudy({
  title: "Chapa",
  eyebrow: "StudioRass / Chapa",
  embedUrl: "https://www.youtube.com/embed/L0bFlOdZjmU",
  summary:
    "Chapa opens with the StudioRass video and presents the payment story as a clean, motion-first brand piece centered on speed, ease, and clarity.",
  format: "Brand Video, Motion Design",
});

const projects = [
  {
    title: "Ttechnos Logo",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/210173327/Ttechnos",
    caseStudy: ttechnosCaseStudy,
  },
  {
    title: "Halal Catering",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/210007661/Halal-Catering-Logo-Design-and-Identity",
    caseStudy: halalCateringCaseStudy,
  },
  {
    title: "Women In Muya",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/209914781/Women-In-Muya",
    caseStudy: womenInMuyaCaseStudy,
  },
  {
    title: "Lite Innovate",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/210708431/Lite-Innovate-Logo-and-Visual-Identity-Design",
    caseStudy: liteInnovateCaseStudy,
  },
  {
    title: "Alenelachu",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/199019247/Alenelachu-Logo-Design",
    caseStudy: alenelachuCaseStudy,
  },
  {
    title: "Air pods Max",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/193955523/Air-pods-Max",
    caseStudy: airpodMaxCaseStudy,
  },
  {
    title: "Marshall.",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/193789767/MARSHAL-Action-III-Product-Commercial",
    caseStudy: marshallCaseStudy,
  },
  {
    title: "Show reel - 2025",
    source: "Native project case study",
    referenceUrl: "https://www.behance.net/gallery/231914735/StudioRass-Show-Reel",
    caseStudy: showReelCaseStudy,
  },
  {
    title: "Afriwork Platform",
    source: "Native project case study",
    caseStudy: afriworkPlatformCaseStudy,
  },
  {
    title: "Afriwork Ai",
    source: "Native project case study",
    caseStudy: afriworkAiCaseStudy,
  },
  {
    title: "Caynetic Voice - Ad",
    source: "Native project case study",
    caseStudy: cayneticVoiceCaseStudy,
  },
  {
    title: "Chapa",
    source: "Native project case study",
    caseStudy: chapaCaseStudy,
  },
].map((project, index) => {
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
    source: project.source ?? (resolvedEmbedUrl ? "Behance project" : "Project folder"),
    ...project,
    embedUrl: resolvedEmbedUrl,
  };
});

const createProjectFolders = (portfolioProjects) => portfolioProjects.map((project, index) => ({
  ...project,
  className: `folder-${index + 1}`,
  x: (portfolioProjects.length - index - 1) * 14,
  y: 48 + index * 10,
  rotate: 0,
}));

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

const AE_FPS = 29.97;
const OPEN_DURATION = 30 / AE_FPS;
const OPEN_MID_TIME = 4 / 30;
const OPEN_OVERSHOOT_TIME = 8 / 30;
const OPEN_SETTLE_TIME = 27 / 30;
const CLOSE_DURATION = 13 / AE_FPS;
const CLOSE_UNDERSHOOT_TIME = 9 / 13;

const CLOSED_WIDTH = 112;
const CLOSED_HEIGHT = 42;
const OPEN_WIDTH = 286;
const OPEN_HEIGHT = 162;
const CLOSED_Y = 22;
const OPEN_Y = 0;
const OPEN_MID_WIDTH = 194;
const OPEN_MID_HEIGHT = 74;
const OPEN_MID_Y = 9;
const OPEN_MID_RADIUS = 27;

const OPEN_OVERSHOOT_X = 54.6 / 47.5;
const OPEN_OVERSHOOT_Y = 32.5 / 28.3;
const CLOSE_UNDERSHOOT_X = 11.8 / 16.5;
const CLOSE_UNDERSHOOT_Y = 4.3 / 6.3;

const musicIslandOpenTransition = {
  duration: OPEN_DURATION,
  times: [0, OPEN_MID_TIME, OPEN_OVERSHOOT_TIME, OPEN_SETTLE_TIME, 1],
  ease: [
    [0.18, 0.9, 0.16, 1],
    [0.07, 0.88, 0.16, 1],
    [0.24, 0.82, 0.32, 1],
    "linear",
  ],
};

const musicIslandCloseTransition = {
  duration: CLOSE_DURATION,
  times: [0, CLOSE_UNDERSHOOT_TIME, 1],
  ease: [
    [0.64, 0.01, 0.9, 0.2],
    [0.06, 0.94, 0.22, 1],
  ],
};

const musicIslandOpenShell = {
  width: [CLOSED_WIDTH, OPEN_MID_WIDTH, OPEN_WIDTH * OPEN_OVERSHOOT_X, OPEN_WIDTH, OPEN_WIDTH],
  height: [CLOSED_HEIGHT, OPEN_MID_HEIGHT, OPEN_HEIGHT * OPEN_OVERSHOOT_Y, OPEN_HEIGHT, OPEN_HEIGHT],
  y: [CLOSED_Y, OPEN_MID_Y, -4, OPEN_Y, OPEN_Y],
  borderRadius: [21, OPEN_MID_RADIUS, 34.5, 30, 30],
  transition: musicIslandOpenTransition,
};

const musicIslandClosedShell = {
  width: [OPEN_WIDTH, CLOSED_WIDTH * CLOSE_UNDERSHOOT_X, CLOSED_WIDTH],
  height: [OPEN_HEIGHT, CLOSED_HEIGHT * CLOSE_UNDERSHOOT_Y, CLOSED_HEIGHT],
  y: [OPEN_Y, 26, CLOSED_Y],
  borderRadius: [30, 14.5, 21],
  transition: musicIslandCloseTransition,
};

const musicCompactContentOpen = {
  opacity: [1, 1, 1, 0, 0],
  scale: [1, 1.01, 1.01, 0.96, 0.96],
  transition: {
    duration: OPEN_DURATION,
    times: [0, OPEN_MID_TIME, OPEN_OVERSHOOT_TIME * 0.88, OPEN_OVERSHOOT_TIME, 1],
    ease: ["linear", "linear", [0.4, 0, 0.2, 1], "linear"],
  },
};

const musicCompactContentClosed = {
  opacity: [0, 0, 1],
  scale: [0.95, 0.97, 1],
  transition: {
    duration: CLOSE_DURATION,
    times: [0, CLOSE_UNDERSHOOT_TIME, 1],
    ease: ["linear", [0.08, 0.94, 0.24, 1]],
  },
};

const musicExpandedContentOpen = {
  opacity: [0, 0, 0, 1, 1],
  scale: [0.96, 0.96, 0.97, 1, 1],
  transition: {
    duration: OPEN_DURATION,
    times: [0, OPEN_MID_TIME, OPEN_OVERSHOOT_TIME * 0.92, OPEN_SETTLE_TIME, 1],
    ease: ["linear", "linear", [0.22, 1, 0.36, 1], "linear"],
  },
};

const musicExpandedContentClosed = {
  opacity: [1, 0, 0],
  scale: [1, 0.93, 0.95],
  transition: {
    duration: CLOSE_DURATION,
    times: [0, CLOSE_UNDERSHOOT_TIME * 0.7, 1],
    ease: [[0.42, 0, 0.18, 1], [0.08, 0.9, 0.22, 1]],
  },
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

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
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
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
}

function ProjectCaseStudy({ project }) {
  const { caseStudy } = project;

  return (
    <article className="project-case-study">
      {caseStudy.sections.map((section, index) => {
        const isIntro = index === 0;
        const isLastSection = index === caseStudy.sections.length - 1;
        const isMediaOnly = section.layout === "media-only";
        const showCredits = isLastSection && section.showCredits !== false;

        return (
          <section
            key={`${section.label}-${index}`}
            className={`project-case-study__flow-section${
              isIntro ? " project-case-study__flow-section--intro" : ""
            }${
              isMediaOnly ? " project-case-study__flow-section--media-only" : ""
            }`}
          >
            <div
              className={`project-case-study__flow-media${
                section.media.length === 1 ? " is-single" : ""
              }`}
            >
              {section.media.map((item, mediaIndex) => (
                <figure
                  key={item.src ?? item.videoUrl}
                  className={`project-case-study__media ${item.className ?? ""}`.trim()}
                >
                  {item.type === "video" && item.embedUrl ? (
                    <iframe
                      src={item.embedUrl}
                      title={item.alt}
                      loading={isIntro && mediaIndex === 0 ? "eager" : "lazy"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading={isIntro && mediaIndex === 0 ? "eager" : "lazy"}
                    />
                  )}
                </figure>
              ))}
            </div>

            {!isMediaOnly ? (
              <aside className="project-case-study__flow-copy">
                {isIntro ? (
                  <>
                    <p className="project-case-study__eyebrow">{caseStudy.eyebrow}</p>
                    <h1 className="project-case-study__title">{project.title}</h1>
                  </>
                ) : (
                  <p className="project-case-study__section-label">{section.label}</p>
                )}

                <div className="project-case-study__body-copy">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="project-case-study__body-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {showCredits ? (
                  <div className="project-case-study__credits">
                    <p className="project-case-study__credits-label">Credits</p>
                    <div className="project-case-study__credits-list">
                      {caseStudy.credits.map((item) => (
                        <p key={item.label} className="project-case-study__credit-line">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </p>
                      ))}
                      {project.referenceUrl ? (
                        <p className="project-case-study__credit-line">
                          <span>Reference</span>
                          <a href={project.referenceUrl} target="_blank" rel="noreferrer">
                            Behance Original
                          </a>
                        </p>
                      ) : null}
                    </div>
                    <p className="project-case-study__credit">{caseStudy.credit}</p>
                  </div>
                ) : null}
              </aside>
            ) : null}
          </section>
        );
      })}
    </article>
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

function App() {
  const [activePortfolioTab, setActivePortfolioTab] = useState("Projects");
  const [isFolderStackInteractive, setIsFolderStackInteractive] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectWindowOpen, setIsProjectWindowOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [expandedCareerIndex, setExpandedCareerIndex] = useState(null);
  const [currentClock, setCurrentClock] = useState(() => new Date());
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const musicPanelRef = useRef(null);
  const volumeControlRef = useRef(null);
  const timePanelRef = useRef(null);
  const folderOriginRef = useRef(null);
  const audioRef = useRef(null);
  const shouldAutoplayTrackRef = useRef(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (isVolumeOpen && !volumeControlRef.current?.contains(event.target)) {
        setIsVolumeOpen(false);
      }

      if (isMusicOpen && !musicPanelRef.current?.contains(event.target)) {
        setIsMusicOpen(false);
        setIsVolumeOpen(false);
      }

      if (isTimeOpen && !timePanelRef.current?.contains(event.target)) {
        setIsTimeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMusicOpen, isTimeOpen, isVolumeOpen]);

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
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }

    if (!shouldAutoplayTrackRef.current) {
      setIsAudioPlaying(false);
      return;
    }

    shouldAutoplayTrackRef.current = false;

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.error(error);
        setIsAudioPlaying(false);
      });
    }
  }, [activeTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const { overflow } = document.body.style;

    if (isProjectWindowOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isProjectWindowOpen]);

  const handleOpenMusic = () => {
    setIsMusicOpen(true);
  };

  const handleTogglePlayback = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!isMusicOpen) {
      setIsMusicOpen(true);
    }

    if (isAudioPlaying) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.error(error);
        setIsAudioPlaying(false);
      });
    }
  };

  const queueTrack = (nextIndex, autoplay = true) => {
    const normalizedIndex = (nextIndex + musicTracks.length) % musicTracks.length;
    shouldAutoplayTrackRef.current = autoplay;
    setActiveTrackIndex(normalizedIndex);
  };

  const handlePreviousTrack = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      if (!isAudioPlaying) {
        const playPromise = audio.play();
        if (playPromise?.catch) {
          playPromise.catch((error) => {
            console.error(error);
            setIsAudioPlaying(false);
          });
        }
      }
      return;
    }

    queueTrack(activeTrackIndex - 1);
  };

  const handleNextTrack = (event) => {
    event.preventDefault();
    event.stopPropagation();
    queueTrack(activeTrackIndex + 1);
  };

  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    setCurrentTime(nextTime);

    if (audio) {
      audio.currentTime = nextTime;
    }
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
  };

  const handleToggleVolumePopup = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsVolumeOpen((current) => !current);
  };

  const handleToggleTimePill = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsTimeOpen((current) => !current);
  };

  const currentTrack = musicTracks[activeTrackIndex];
  const progressMax = duration > 0 ? duration : 1;
  const progressFill = `${Math.min((currentTime / progressMax) * 100, 100)}%`;
  const volumeFill = `${volume * 100}%`;
  const currentClockLabel = getCurrentClockLabel(currentClock);
  const minuteAngle = currentClock.getMinutes() * 6 + currentClock.getSeconds() * 0.1;
  const hourAngle =
    ((currentClock.getHours() % 12) + currentClock.getMinutes() / 60) * 30;
  const visibleProjects = [...projects].sort((leftProject, rightProject) => {
    const leftIsMotion = motionProjectTitles.has(leftProject.title);
    const rightIsMotion = motionProjectTitles.has(rightProject.title);

    if (leftIsMotion !== rightIsMotion) {
      return leftIsMotion ? -1 : 1;
    }

    return leftProject.order - rightProject.order;
  });
  const projectFolders = createProjectFolders(visibleProjects);

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
    setSelectedProject(null);
    setIsProjectWindowOpen(false);
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

    setSelectedProject(activeProject);
    setHoveredProjectId(activeProject.id);
    setIsProjectWindowOpen(true);
  };

  const handleCloseProjectWindow = () => {
    setIsProjectWindowOpen(false);
    setHoveredProjectId(null);
  };

  const activePreviewProject =
    projectFolders.find((project) => project.id === hoveredProjectId) ??
    (isProjectWindowOpen ? selectedProject : null) ??
    projectFolders[projectFolders.length - 1];
  const isFunStuffTab = activePortfolioTab === "Fun stuff I made";
  const isCareerTab = activePortfolioTab === "Career";

  return (
    <main className="page-shell">
      <motion.section id="career" className="masthead" initial="hidden" animate="show">
        <div className="masthead-row">
          <motion.div className="profile-stack" variants={reveal} custom={0.05}>
            <div className="profile-chip" aria-label="Profile">
              <ProfileAvatar />
            </div>
          </motion.div>

          <motion.div
            className="music-panel-shell"
            variants={reveal}
            custom={0.12}
            ref={musicPanelRef}
          >
            <audio
              ref={audioRef}
              className="music-audio-element"
              src={currentTrack.src}
              preload="metadata"
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
              onLoadedMetadata={(event) => {
                const nextDuration = event.currentTarget.duration;
                setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onEnded={() => queueTrack(activeTrackIndex + 1)}
            />

            <motion.div
              className={`music-island ${isMusicOpen ? "music-island--open" : "music-island--closed"}`}
              style={{ x: "-50%" }}
              initial={false}
              animate={isMusicOpen ? musicIslandOpenShell : musicIslandClosedShell}
              onClick={() => {
                if (!isMusicOpen) {
                  handleOpenMusic();
                }
              }}
              onKeyDown={(event) => {
                if (!isMusicOpen && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  handleOpenMusic();
                }
              }}
              role={!isMusicOpen ? "button" : undefined}
              tabIndex={!isMusicOpen ? 0 : -1}
              aria-label={!isMusicOpen ? "Open music player" : undefined}
              aria-expanded={!isMusicOpen ? false : undefined}
              whileHover={!isMusicOpen ? { scale: 1.01 } : undefined}
              whileTap={!isMusicOpen ? { scale: 0.985 } : undefined}
            >
              <motion.div
                className="music-island__compact"
                initial={false}
                animate={isMusicOpen ? musicCompactContentOpen : musicCompactContentClosed}
                aria-hidden={isMusicOpen}
              >
                <span className="audio-knob" />
                <span
                  className={`audio-bars ${isAudioPlaying ? "audio-bars--active" : ""}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </span>
              </motion.div>

              <motion.div
                className="music-island__expanded"
                initial={false}
                animate={isMusicOpen ? musicExpandedContentOpen : musicExpandedContentClosed}
                aria-hidden={!isMusicOpen}
              >
                <div className="music-card">
                  <div className="music-card__meta">
                    <div className="music-card__cover" aria-hidden="true">
                      <span className="music-card__cover-glow" />
                    </div>
                    <div className="music-card__copy">
                      <p className="music-card__title">{currentTrack.title}</p>
                      <p className="music-card__artist">{currentTrack.artist}</p>
                    </div>
                  </div>

                  <div className="music-card__timeline">
                    <input
                      type="range"
                      className="music-range music-range--progress"
                      min="0"
                      max={progressMax}
                      step="0.01"
                      value={Math.min(currentTime, progressMax)}
                      style={{ "--range-fill": progressFill }}
                      onChange={handleProgressChange}
                      aria-label="Track progress"
                    />

                    <div className="music-card__timebar">
                      <span className="music-card__time">{formatTime(currentTime)}</span>
                      <span className="music-card__time">
                        {duration > 0 ? formatTime(duration) : "--:--"}
                      </span>
                    </div>
                  </div>

                  <div className="music-card__footer">
                    <div className="music-card__controls">
                      <button
                        type="button"
                        className="music-control"
                        onClick={handlePreviousTrack}
                        aria-label="Previous track"
                      >
                        <span className="music-icon music-icon--prev" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        className="music-control music-control--primary"
                        onClick={handleTogglePlayback}
                        aria-label={isAudioPlaying ? "Pause track" : "Play track"}
                      >
                        <span
                          className={`music-icon ${
                            isAudioPlaying ? "music-icon--pause" : "music-icon--play"
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        className="music-control"
                        onClick={handleNextTrack}
                        aria-label="Next track"
                      >
                        <span className="music-icon music-icon--next" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="music-volume-popover" ref={volumeControlRef}>
                      <button
                        type="button"
                        className={`music-volume-trigger ${isVolumeOpen ? "is-open" : ""}`}
                        onClick={handleToggleVolumePopup}
                        aria-label="Volume"
                        aria-expanded={isVolumeOpen}
                      >
                        <span className="music-volume__icon" aria-hidden="true" />
                      </button>

                      <div
                        className={`music-volume-popup ${isVolumeOpen ? "is-open" : ""}`}
                        aria-hidden={!isVolumeOpen}
                      >
                        <input
                          type="range"
                          className="music-range music-range--volume"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          style={{ "--range-fill": volumeFill }}
                          onChange={handleVolumeChange}
                          aria-label="Volume"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

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
                <g className="time-pill__hand-group" transform={`rotate(${hourAngle} 50 50)`}>
                  <line
                    className="time-pill__hand time-pill__hand--hour"
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="31"
                  />
                </g>
                <g className="time-pill__hand-group" transform={`rotate(${minuteAngle} 50 50)`}>
                  <line
                    className="time-pill__hand time-pill__hand--minute"
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="22"
                  />
                </g>
                <circle className="time-pill__pivot" cx="50" cy="50" r="3.2" />
              </svg>

              <span className="time-pill__clock">{currentClockLabel}</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="profile-copy" variants={reveal} custom={0.15}>
          <p className="profile-name">Nahu Gebreamlak</p>
          <p className="profile-role">Graphic designer, Motion Designer</p>
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

          <button
            type="button"
            className={`masthead-right-link ${isCareerTab ? "active" : ""}`}
            onClick={() => handlePortfolioTabSelect("Career")}
          >
            Career
          </button>
        </motion.div>
      </motion.section>

      <motion.section
        id="showcase"
        className={`showcase-card ${isFunStuffTab ? "showcase-card--fun" : ""} ${
          isCareerTab ? "showcase-card--career" : ""
        }`}
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
                <div className="career-intro__accents" aria-hidden="true">
                  {careerProfile.accents.map((emoji, index) => (
                    <img
                      key={`${emoji}-${index}`}
                      className="career-intro__accent"
                      src={emoji}
                      alt=""
                    />
                  ))}
                </div>
              </div>
              <div className="career-intro__body">
                {careerProfile.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="career-intro__skills" aria-label="Top skills">
                {careerProfile.skills.map((skill) => (
                  <span key={skill.label} className="career-intro__skill">
                    <img className="career-intro__skill-icon" src={skill.icon} alt="" aria-hidden="true" />
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
                          <img
                            className="career-list__summary-icon"
                            src={emojiAssets.hundred}
                            alt=""
                            aria-hidden="true"
                          />
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
          <div className="fun-feed" aria-label="Fun stuff feed">
            <div className="fun-feed__header">
              <div>
                <p className="fun-feed__eyebrow">{funStuffFeed.title}</p>
                <p className="fun-feed__subtitle">{funStuffFeed.subtitle}</p>
              </div>
              <img
                className="fun-feed__header-emoji"
                src={emojiAssets.sunglasses}
                alt=""
                aria-hidden="true"
              />
            </div>

            <div className="fun-feed__timeline">
              {funStuffPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="fun-post"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.05 + index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="fun-post__avatar">
                    <img src={post.mood} alt="" aria-hidden="true" />
                  </div>

                  <div className="fun-post__body">
                    <div className="fun-post__meta">
                      <span className="fun-post__name">{funStuffFeed.profileName}</span>
                      <span className="fun-post__handle">{funStuffFeed.handle}</span>
                      <span className="fun-post__dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="fun-post__time">{post.timestamp}</span>
                    </div>

                    <p className="fun-post__caption">{post.caption}</p>

                    {post.media ? (
                      <div className="fun-post__media fun-post__media--placeholder" aria-hidden="true">
                        <span>{post.media.label}</span>
                      </div>
                    ) : null}

                    <div className="fun-post__actions" aria-hidden="true">
                      <span className="fun-post__action">
                        <span className="fun-post__action-icon fun-post__action-icon--comment" />
                        <span className="fun-post__action-label">Comment</span>
                      </span>
                      <span className="fun-post__action">
                        <span className="fun-post__action-icon fun-post__action-icon--share" />
                        <span className="fun-post__action-label">Share</span>
                      </span>
                      <span className="fun-post__action">
                        <span className="fun-post__action-icon fun-post__action-icon--save" />
                        <span className="fun-post__action-label">Save</span>
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
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
                  const isSelected =
                    isProjectWindowOpen && selectedProject?.id === project.id;
                  const liftDistance = isHovered ? 34 : isSelected ? 16 : 0;
                  const liftedY = project.y - liftDistance;
                  const entranceDelay = (projectFolders.length - index - 1) * 0.045;
                  const motionDelay = isFolderStackInteractive ? 0 : entranceDelay;

                  return (
                    <motion.div
                      key={project.id}
                      className={`folder-stack ${project.className} ${
                        isSelected ? "is-selected" : ""
                      }`}
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
                          setSelectedProject(project);
                          setHoveredProjectId(project.id);
                          setIsProjectWindowOpen(true);
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <span className="folder-tab-button__index">
                          {String(project.order).padStart(2, "0")}
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

        <AnimatePresence>
          {isProjectWindowOpen && selectedProject ? (
            <motion.div
              className="project-window-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseProjectWindow}
            >
              <motion.article
                className="project-window"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <header className="project-window__header">
                  <div className="project-window__meta">
                    <span className="project-window__dot" aria-hidden="true" />
                    <div>
                      <p className="project-window__title">{selectedProject.title}</p>
                      <p className="project-window__source">{selectedProject.source}</p>
                    </div>
                  </div>

                  <div className="project-window__actions">
                    {!selectedProject.caseStudy && !selectedProject.embedUrl && selectedProject.url ? (
                      <a
                        className="project-window__link"
                        href={selectedProject.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    ) : !selectedProject.caseStudy && !selectedProject.embedUrl ? (
                      <span className="project-window__status">Coming soon</span>
                    ) : null}
                    <button
                      type="button"
                      className="project-window__close"
                      onClick={handleCloseProjectWindow}
                      aria-label="Close project window"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </header>

                <div className="project-window__body">
                  {selectedProject.caseStudy ? (
                    <ProjectCaseStudy project={selectedProject} />
                  ) : selectedProject.embedUrl ? (
                    <iframe
                      className="project-window__frame"
                      src={selectedProject.embedUrl}
                      title={selectedProject.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <div className="project-window__placeholder">
                      <span className="project-window__placeholder-tag">
                        Portfolio project
                      </span>
                      <h2 className="project-window__placeholder-title">
                        {selectedProject.title}
                      </h2>
                      <p className="project-window__placeholder-copy">
                        This folder is ready for mockups, motion clips, a case study, or an
                        external link whenever you want to plug the full project in.
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.section>
    </main>
  );
}

export default App;
