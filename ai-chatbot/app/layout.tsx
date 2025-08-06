import "./globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/context/sidebar-context"; // ✅ Add this line

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Assistify",
  description: "Helpdesk for HR & Employee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
