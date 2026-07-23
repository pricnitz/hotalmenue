import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://tablemenu.in"),
  title: {
    default: "TableMenu.in | Cloud QR Digital Menu, KDS & Restaurant Billing OS",
    template: "%s | TableMenu.in",
  },
  description:
    "TableMenu.in is a cloud-based restaurant operating system offering digital QR menus, Kitchen Display Systems (KDS), and automated multi-currency POS billing. Affiliated with & powered by Code World Sol (codeworldsol.com).",
  keywords: [
    "QR Menu",
    "Digital Menu for Restaurants",
    "Kitchen Display System KDS",
    "Restaurant POS Billing",
    "Table Menu India",
    "Code World Sol",
    "Bhopal Restaurant Software",
  ],
  authors: [
    { name: "Payal Pandit", url: "https://tablemenu.in" },
    { name: "Durgawati Pandit", url: "https://tablemenu.in" },
    { name: "Nitesh Ahirwar", url: "https://codeworldsol.com" },
  ],
  creator: "Code World Sol (codeworldsol.com)",
  publisher: "Code World Sol",
  openGraph: {
    title: "TableMenu.in | Modern QR Menu & Kitchen Operating System",
    description:
      "Transform your restaurant with scan-to-order QR menus, color-coded KDS timers, and instant billing. Zero print costs, 100% cloud agility.",
    url: "https://tablemenu.in",
    siteName: "TableMenu.in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TableMenu.in | Restaurant QR Menu & KDS OS",
    description: "Scan, order, and manage kitchen prep instantly. Powered by Code World Sol.",
  },
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Bhopal, MP, India",
    "geo.position": "23.2599;77.4126",
    "ICBM": "23.2599, 77.4126",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TableMenu.in",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
    },
    "author": {
      "@type": "Organization",
      "name": "Code World Sol",
      "url": "https://codeworldsol.com",
    },
    "description":
      "Cloud-based digital QR menu, kitchen display screen (KDS), and automated restaurant billing software.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
