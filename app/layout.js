import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata = {
  title: "DevTok",
  description: "A short daily feed of front-end dev posts. Finish it, then go build.",
  applicationName: "DevTok",
  appleWebApp: { capable: true, title: "DevTok", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14121f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
