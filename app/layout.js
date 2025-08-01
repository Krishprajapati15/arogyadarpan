import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";

import React from "react";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";

const inter = Inter({ subsets: ["latin"] });

const people = [
  {
    id: 1,
    name: "Krish Prajapati",
    designation: "Full Stack & AI Developer",
    image:
      "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
  },
  {
    id: 2,
    name: "Jinil Prajapati",
    designation: "Frontend & DataBase Developer",
    image:
      "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
  },
  {
    id: 3,
    name: "Krish Prajapati",
    designation: "Full Stack & AI Developer",
    image:
      "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
  },
  {
    id: 4,
    name: "Jinil Prajapati",
    designation: "Frontend & DataBase Developer",
    image:
      "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
  },
  {
    id: 5,
    name: "Krish Prajapati",
    designation: "Full Stack & AI Developer",
    image:
      "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
  },
  {
    id: 6,
    name: "Jinil Prajapati",
    designation: "Frontend & DataBase Developer",
    image:
      "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
  },
];

function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-4 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}

export const metadata = {
  title: "ArogyaDarpan - Your Health Companion",
  description:
    " ArogyaDarpan is your personal health companion, providing insights and tools to manage your health effectively.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-8">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <AnimatedTooltipPreview />
                <p>
                  © {new Date().getFullYear()} ArogyaDarpan. Crafted with
                  passion by Krish & Jainil
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
