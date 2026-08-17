import type { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const base = new URL(`${protocol}://${host}`);
  const title = "Strive Africa | Beyond Borders";
  const description = "University placement, applications, career guidance, visa support and flight bookings from Zimbabwe to the world.";
  return { metadataBase: base, title, description, icons:{icon:"/strive-logo.jpeg"}, openGraph:{title,description,images:[new URL("/og.png",base).toString()]}, twitter:{card:"summary_large_image",title,description,images:[new URL("/og.png",base).toString()]}};
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
