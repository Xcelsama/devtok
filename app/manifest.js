export default function manifest() {
  return {
    name: "DevTok",
    short_name: "DevTok",
    description: "A short daily feed of front-end dev posts.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#14121f",
    theme_color: "#14121f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
