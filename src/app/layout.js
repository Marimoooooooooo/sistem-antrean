import "./globals.css";

export const metadata = {
  title: "ZenithQueue - Enterprise Student Queue System",
  description: "Sistem antrean mahasiswa enterprise dengan manajemen loket, monitoring real-time, dan analitik layanan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="font-['Inter'] antialiased">
        {children}
      </body>
    </html>
  );
}
