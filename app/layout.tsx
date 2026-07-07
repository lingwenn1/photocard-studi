import type { Metadata, Viewport } from "next";
import { Fredoka, Plus_Jakarta_Sans, JetBrains_Mono, Caveat, Playfair_Display, Baloo_2, Mochiy_Pop_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});
const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
});
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-playfair" });
const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-baloo" });
const mochiy = Mochiy_Pop_One({ subsets: ["latin"], weight: ["400"], variable: "--font-mochiy" });

export const metadata: Metadata = {
  title: "Photocard Studio — редактор фотокарточек",
  description:
    "Создавай фотокарточки со скруглёнными уголками, картхолдерами, стикерами и голографическими эффектами.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7FF" },
    { media: "(prefers-color-scheme: dark)", color: "#13101F" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} ${jakarta.variable} ${jbmono.variable} ${caveat.variable} ${playfair.variable} ${baloo.variable} ${mochiy.variable} font-body antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
