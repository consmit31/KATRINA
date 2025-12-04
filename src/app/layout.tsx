import "./globals.css";

import HeaderComponent from "./components/Header/HeaderComponent";

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
        <HeaderComponent/>
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
