import Link from "next/link";
import Image from "next/image";

import "./globals.css";

import ShortcutsTooltips from "./components/ShortcutsTooltips";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  title: 'KATRINA',
  description: 'Knowledge-base Assistant for Ticket Resolution & Incident Navigation Automation',
  icons: {
    icon: './favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Image src="/favicon.ico" alt="KATRINA Logo" width={32} height={32} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">KATRINA</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Knowledge-base Assistant for Ticket Resolution
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="h-6 w-px bg-border"></div>
              <ShortcutsTooltips/>
              <Link 
                href="./" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent focus-ring"
                tabIndex={-1}
              >
                About
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
