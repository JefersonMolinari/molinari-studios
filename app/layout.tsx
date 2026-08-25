import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://molinari-studios.global-relay-0411.chatgpt.site'),
  title: 'Molinari STUDIOS | Custom 3D Printing',
  description:
    'Design-led custom 3D printing for prototypes, replacement parts, display pieces, and small-batch production.',
  openGraph: {
    title: 'Molinari STUDIOS | Ideas, made tangible.',
    description: 'Custom 3D printing · Design-led fabrication',
    type: 'website',
    images: [
      {
        url: 'https://molinari-studios.global-relay-0411.chatgpt.site/og.png',
        width: 1731,
        height: 909,
        alt: 'Molinari STUDIOS — Ideas, made tangible.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Molinari STUDIOS | Ideas, made tangible.',
    description: 'Custom 3D printing · Design-led fabrication',
    images: ['https://molinari-studios.global-relay-0411.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
