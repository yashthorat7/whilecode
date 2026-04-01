import './globals.css';

export const metadata = {
  title: 'WhileCode',
  description: 'Zero-distraction browser IDE for competitive programming in C and C++',
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
      <body className="bg-primary text-primary w-screen h-screen overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
