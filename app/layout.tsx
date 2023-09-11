export const metadata = {
  title: "Recipes",
  description: "Generated by Next.js",
};

import "~/styles/globals.css";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
