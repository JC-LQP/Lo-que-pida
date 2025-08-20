import "./css/style.css";
import "./css/euclid-circular-a-font.css";
import ClientRootLayout from "./ClientRootLayout";

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
