import { Nunito, PT_Serif } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Talent Match",
  description: "AI-powered talent matching platform",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${ptSerif.variable} antialiased relative`}
      >
        <div className="texture" />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
