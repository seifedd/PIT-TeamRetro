import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TeamRetro Local — Retrospectives & Health Checks",
  description: "Run fast, effective, and secure agile retrospectives and team health checks locally. No subscriptions, no cloud data.",
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="grain">
        {children}
      </body>
    </html>
  );
}
