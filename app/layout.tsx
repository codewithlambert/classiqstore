import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Classiq Store — Women's Shoes & Bags",
  description:
    "Classiq Store crafts refined women's shoes and bags in soft neutrals — designed for the woman who accessorizes with intention.",
  metadataBase: new URL("https://classiqstore.pxxl.click"),
  openGraph: {
    title: "CLASSIQ — Women's Shoes & Bags",
    description:
      "Modern women's shoes and bags in soft neutrals. Refined accessories designed for the woman who dresses with intention.",
    type: "website",
    url: "https://classiqstore.pxxl.click",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLASSIQ — Women's Shoes & Bags",
    description:
      "Modern women's shoes and bags in soft neutrals. Refined accessories designed for the woman who dresses with intention.",
  },
};

import CartDrawer from "@/components/site/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
