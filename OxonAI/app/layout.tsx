import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "OxonAI - Build once. Output everywhere.",
    description: "OxonAI turns instructions, data, and intent into real deliverables — documents, dashboards, applications, and media.",
    keywords: ["AI", "artificial intelligence", "automation", "enterprise AI", "AI system"],
    authors: [{ name: "OxonAI" }],
    openGraph: {
        title: "OxonAI - Build once. Output everywhere.",
        description: "OxonAI turns instructions, data, and intent into real deliverables — documents, dashboards, applications, and media.",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "OxonAI - Build once. Output everywhere.",
        description: "OxonAI turns instructions, data, and intent into real deliverables — documents, dashboards, applications, and media.",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0A0A0A",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <Providers>
                    <ThemeProvider>
                        <Navbar />
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
