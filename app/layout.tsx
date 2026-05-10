import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AI Spend Audit - Optimize Your AI Tool Costs",
  description: "Free tool to analyze your AI software spending and discover cost-saving opportunities. Get personalized recommendations for Cursor, GitHub Copilot, Claude, ChatGPT, and more.",
  keywords: "AI spending, cost optimization, AI tools, startup tools, SaaS audit",
  openGraph: {
    title: "AI Spend Audit - Optimize Your AI Tool Costs",
    description: "Discover how much you can save on AI tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit",
    description: "Optimize your AI tool spending",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
