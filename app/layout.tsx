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

        {/* The Phony chat agent, answering from qpu.co's own crawled
            corpus rather than a shared one.

            The key is public by design — it is in every visitor's page source,
            and the property's allowed-origins list on phony.erp.io is what
            restricts where the widget runs.

            The host MUST be phony.erp.io, not app.erp.io/phony. The tag derives
            its API endpoint from the ORIGIN of this src, so a path-mounted URL
            silently loses the /phony prefix: every call goes to app.erp.io,
            /api/w/session 404s, and the widget never draws — no console error
            and nothing logged at either end.

            A plain script rather than next/script: the tag reads
            `document.currentScript` to find its own key and origin, so data-key
            has to sit on the element the browser actually executes.

            Behaviour — the five second delay before the panel opens on desktop,
            never on mobile, and the privacy and terms links under the composer
            — is configured on the property, not here, so it changes without a
            deploy. */}
        <script async src="https://phony.erp.io/sdr.js" data-key="pk_8d062ce831af12cb5bcc8e82fc93c364" />
      </body>
    </html>
  );
}
