import type { Metadata } from "next";
import "./css/style.css";
import "./css/euclid-circular-a-font.css";
import ClientRootLayout from "./ClientRootLayout";

export const metadata: Metadata = {
  title: "Lo Que Pida | E-commerce Platform",
  description: "Welcome to Lo Que Pida - Your premier e-commerce marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
