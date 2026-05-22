import { Montserrat } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutShell from "@/components/LayoutShell";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Artgallery by Raihan Contemporary Calligraphy & Landscape Painting",
  description:
    "A family art gallery presenting original abstract calligraphy by Raihan Mohammad and landscape & nature paintings by Condro Puspitosari. Handmade art from Indonesia, crafted for collectors and premium interiors.",
  keywords:
    "calligraphy art, landscape painting, handmade art Indonesia, contemporary calligraphy, original artwork, fine art gallery, art collectors",
  openGraph: {
    title: "Artgallery by Raihan Contemporary Calligraphy & Landscape Painting",
    description:
      "A family art house presenting original contemporary calligraphy and atmospheric landscape paintings. Handmade art from Indonesia.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <LayoutShell>{children}</LayoutShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
