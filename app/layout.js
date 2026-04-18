import './globals.css';

export const metadata = {
  title: 'WhileCode',
  description: 'Zero-distraction browser IDE for competitive programming in C and C++',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/FiraCode-VariableFont_wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex h-[100svh] w-full flex-col overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
