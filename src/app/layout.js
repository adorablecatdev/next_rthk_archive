import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeWrapper from "./utilities/ThemeWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "香港電台節目重溫",
    description: "隨時重溫及下載香港電台節目",
};

export default function RootLayout({ children })
{
    return (
        <html lang="en">
            <body className="body">
                <ThemeWrapper>{children}</ThemeWrapper>
            </body>
        </html>
    );
}
