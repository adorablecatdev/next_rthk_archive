'use client';
import { ThemeProvider } from "./ThemeContext";

 // Mark this as a Client Component



export default function ThemeWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}