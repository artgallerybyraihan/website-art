import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Artgallery by Raihan — Contemporary Calligraphy & Landscape Painting",
  description:
    "A family art house presenting original contemporary calligraphy by Raihan and atmospheric landscape paintings by Condro P.S. Handmade art from Indonesia, crafted for collectors and interiors.",
  keywords:
    "calligraphy art, landscape painting, handmade art Indonesia, contemporary calligraphy, original artwork, fine art gallery, art collectors",
  openGraph: {
    title: "Artgallery by Raihan — Contemporary Calligraphy & Landscape Painting",
    description:
      "A family art house presenting original contemporary calligraphy and atmospheric landscape paintings. Handmade art from Indonesia.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
