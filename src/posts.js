// Social post designs, grouped the same way as the original folders.
// Images live in /public/assets/posts/<folder>/ as <name>.webp (full) and <name>-sm.webp (grid).
// To add a post: drop the two files in, then add an entry below.

const base = "/assets/posts";

const image = (path, w, h, alt) => ({
  type: "image",
  src: `${base}/${path}.webp`,
  thumb: `${base}/${path}-sm.webp`,
  w,
  h,
  alt,
});

const video = (path, w, h, alt) => ({
  type: "video",
  src: `${base}/${path}.mp4`,
  poster: `${base}/${path}-poster.jpg`,
  w,
  h,
  alt,
});

const slides = (path, count, w, h, label) =>
  Array.from({ length: count }, (_, index) =>
    image(`${path}-${index + 1}`, w, h, `${label}, slide ${index + 1} of ${count}`),
  );

export const postFolders = [
  {
    id: "afriwork",
    name: "Afriwork",
    groups: [
      {
        type: "singles",
        items: [
          image("afriwork/tired-of-rejection", 1920, 1920, "Afriwork post: Tired of getting rejected by employers?"),
          image("afriwork/make-money-design", 1920, 1920, "Afriwork post: Make money with your design skill"),
          image("afriwork/mastering-skills", 1920, 1920, "Afriwork post: Mastering the skills is not landing clients"),
          image("afriwork/learn-new-courses", 2048, 1675, "Afriwork Learn post: We're building new courses, tell us what you need"),
          image("afriwork/boost-job-post", 2048, 2048, "Afriwork post: Boost — make your job post stand out"),
          image("afriwork/get-paid-sharing", 2048, 2048, "Afriwork post: Get paid for sharing job posts"),
          image("afriwork/smes-research", 1080, 1080, "Afriwork research post: SMEs still struggle to hire"),
        ],
      },
      {
        type: "carousel",
        title: "Boost launch",
        items: slides("afriwork/boost-carousel", 4, 2048, 2048, "Afriwork Boost launch carousel"),
      },
    ],
  },
  {
    id: "project-mono",
    name: "Project Mono",
    groups: [
      {
        type: "carousel",
        title: "Typography 101",
        items: slides("project-mono/typography", 8, 2160, 2700, "Project Mono, Typography 101 carousel"),
      },
      {
        type: "carousel",
        title: "Colour psychology",
        items: slides("project-mono/color", 9, 2160, 2700, "Project Mono, colour psychology carousel"),
      },
      {
        type: "carousel",
        title: "Tips & tricks",
        items: slides("project-mono/tips", 3, 4320, 5400, "Project Mono, tips and tricks carousel"),
      },
      {
        type: "videos",
        items: [
          video("project-mono/mono-motion", 1080, 1080, "Animated post: Motion Design Masterclass, learn by recreating a full animation live"),
        ],
      },
    ],
  },
  {
    id: "future-of-work",
    name: "Future of Work",
    groups: [
      {
        type: "singles",
        items: [
          image("future-of-work/invitation", 2160, 2160, "Future of Work Summit 2025 invitation"),
          image("future-of-work/four-days-away", 2160, 2402, "Future of Work Summit countdown: 4 days away"),
          image("future-of-work/live-podcast", 2162, 2162, "Future of Work Summit live podcast announcement"),
          image("future-of-work/panelist", 3176, 2518, "Future of Work Summit panelist announcement"),
        ],
      },
    ],
  },
  {
    id: "tibeb-badebabay",
    name: "Tibeb Badebabay",
    groups: [
      {
        type: "singles",
        items: [
          image("tibeb/dialogue", 3240, 4050, "Tibeb Station 9th edition poster: Dialogue on managing cultural hubs, May 14"),
          image("tibeb/live-music", 3240, 4050, "Tibeb Station 9th edition poster: Live music performance at Tewodros Square, May 15"),
          image("tibeb/urban-sketching", 3240, 4050, "Tibeb Station 9th edition poster: Urban sketching, May 16 and 23"),
          image("tibeb/workshop", 3240, 4050, "Tibeb Station 9th edition poster: Capacity building workshop for artists, May 19"),
        ],
      },
    ],
  },
  {
    id: "animated",
    name: "Animated",
    groups: [
      {
        type: "videos",
        items: [
          video("animated/boosting", 1080, 1080, "Animated post: Afriwork Boost launch"),
          video("animated/comp-1", 1080, 1080, "Animated post: Get paid for sharing job posts"),
          video("animated/comp-2", 1080, 1080, "Animated post: Stories in Motion festival theme"),
          video("animated/summit-teaser", 1080, 1080, "Animated teaser for the Future of Work Summit"),
          video("animated/vertical", 1080, 1920, "Animated story: Something big is coming your way"),
          video("fun/motion-1", 1080, 1080, "Motion experiment: shapes stacking in pink light"),
          video("fun/motion-2", 1920, 1080, "Kinetic type: The Power of Motion"),
          video("fun/motion-3", 1080, 1080, "Animated Amharic poster with a portrait in a frame"),
        ],
      },
    ],
  },
  {
    id: "random-fun-stuff",
    name: "Random fun stuff",
    groups: [
      {
        type: "singles",
        layout: "stories",
        items: [
          image("fun/five-min-1", 4320, 7680, "5-minute design: Don't design for designers, design for people"),
          image("fun/five-min-2", 4320, 7680, "5-minute design: Good design is as little design as possible"),
          image("fun/five-min-3", 4320, 7680, "5-minute design: Error is by far the most interesting part of design"),
          image("fun/five-min-4", 4320, 7680, "5-minute design: Most best ideas come from jokes"),
          image("fun/five-min-5", 4320, 7680, "5-minute design: Slower is smoother, smoother is faster"),
        ],
      },
    ],
  },
];

// A carousel counts as one post; singles and videos count one each.
export const countFolderPosts = (folder) =>
  folder.groups.reduce(
    (total, group) => total + (group.type === "carousel" ? 1 : group.items.length),
    0,
  );
