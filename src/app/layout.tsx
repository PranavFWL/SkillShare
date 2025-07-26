import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillShare - Share Skill",
  description: "Skill For Skill - Share your skills with others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorBackground: '#ffffff',
          colorPrimary: '#7c3aed',
        },
        elements: {
          applicationName: 'Skill Share'
        }
      }}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Skill Share",
            subtitle: "Welcome back! Please sign in to continue"
          }
        },
        signUp: {
          start: {
            title: "Create your Skill Share account",
            subtitle: "Welcome! Please fill in the details to get started"
          }
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
