import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import DynamicAds from "@/components/DynamicAds";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bili Mod - Download Mod APK Files",
  description: "Provide users with safe downloads of Android apps, games, and modded APK versions with detailed information, screenshots, and installation guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <DynamicAds />
        </ThemeProvider>
      </body>
    </html>
  );
}
