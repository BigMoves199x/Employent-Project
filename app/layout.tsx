import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import Footer from "@/app/ui/footer";
import Navbar from "@/app/ui/navbar";
import Script from "next/script"; 

export const metadata = {
  title: "Vaco",
  description: "Vaco job application platform",
  icons: {
    icon: "/What.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen`}
      >
        {/* ✅ Tawk.to Chat Widget */}
        <Script id="tawkto-chat-widget" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/687d1f75ec9db219126f23eb/1j0kc5pnp';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();

          `}
        </Script>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
