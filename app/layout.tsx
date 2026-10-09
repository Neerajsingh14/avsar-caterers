import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/ui/Preloader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Avsar Caterers | Premium Wedding & Event Catering in Rajasthan";
const description =
  "Avsar Caterers provides premium wedding, event and destination catering services in Rajasthan and selected locations across India, with customized menus, professional hospitality and event catering solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", siteName: "Avsar Caterers", locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#080504" };

const bootScript =
  "try{if('scrollRestoration' in history)history.scrollRestoration='manual';" +
  "if(location.hash)history.replaceState(null,'',location.pathname+location.search);" +
  "window.scrollTo(0,0);" +
  "var t=localStorage.getItem('avsar-theme-v2');" +
  "if(t&&t!=='gold')document.documentElement.dataset.theme=t}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={playfair.variable + " " + inter.variable}>
      <body className="bg-ink font-sans text-white antialiased">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Preloader />
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        {children}
      </body>
    </html>
  );
}