import type { Metadata } from 'next';
import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = (
  process.env.SITE_URL ??
  'https://molinari-studios.global-relay-0411.chatgpt.site'
).replace(/\/$/, '');
const socialImageUrl = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: 'Molinari STUDIOS | Custom 3D Printing',
  description:
    'Design-led custom 3D printing for prototypes, replacement parts, display pieces, and small-batch production.',
  icons: {
    icon: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title: 'Molinari STUDIOS | Ideas, made tangible.',
    description: 'Custom 3D printing · Design-led fabrication',
    type: 'website',
    images: [
      {
        url: socialImageUrl,
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
    images: [socialImageUrl],
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
