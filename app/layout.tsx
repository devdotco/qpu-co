import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CompareTray from "@/components/navigation/CompareTray";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qpu.co"),
  title: {
    default: "QPU.co — The World's Quantum Computers. One Platform.",
    template: "%s | QPU.co",
  },
  description:
    "Independent quantum-computing hardware intelligence. Compare QPUs, architectures, providers, benchmarks, and access options for quantum processors.",
  keywords: [
    "quantum processing unit",
    "QPU",
    "quantum computer",
    "quantum computing",
    "qubit",
    "quantum hardware",
    "IBM Quantum",
    "IonQ",
    "Quantinuum",
    "superconducting qubit",
    "trapped ion",
  ],
  authors: [{ name: "QPU.co" }],
  creator: "QPU.co",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qpu.co",
    siteName: "QPU.co",
    title: "QPU.co — The World's Quantum Computers. One Platform.",
    description:
      "Independent quantum-computing hardware intelligence. Compare quantum processors, architectures, providers, and access options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QPU.co — The World's Quantum Computers. One Platform.",
    description:
      "Independent quantum-computing hardware intelligence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <CompareTray />
      </body>
    </html>
  );
}
