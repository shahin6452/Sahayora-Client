
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Sahayora — Together, We Make a Difference",
    template: "%s | Sahayora",
  },
  description:
    "Discover community events, volunteer opportunities, and local initiatives. Join Sahayora and help create positive change together.",
  applicationName: "Sahayora",
  keywords: [
    "Sahayora",
    "Community Events",
    "Volunteering",
    "Social Development",
    "Community Support",
    "Donation",
  ],
};
//  
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
