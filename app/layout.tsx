import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhilzBab Agent - 3D Website Builder',
  description: 'AI-powered agent for creating high-quality 3D responsive websites',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark text-light antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
