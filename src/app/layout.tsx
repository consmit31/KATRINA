import Link from "next/link";
import "./globals.css";

import ShortcutsTooltips from "./components/ShortcutsTooltips";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <header>
          <span className="flex justify-between px-10 bg-gray-700">
            <p>KATRINA</p>
            <ShortcutsTooltips/>       
            <Link href={"./"} tabIndex={-1}>About</Link>
          </span>
          <div>
            {/* <p>Knowledge-base Assistant for Ticket Resolution & Incident Navigation Automation</p> */}
          </div>
        </header>
        <main className="h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
