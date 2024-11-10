import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { SnackbarProvider } from "notistack";

const JetBrainsMono = localFont({
  src: "./fonts/nimbus-sans-l/NimbusSanL-Reg.otf",
  // src: "./fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Bold.woff2",
  variable: "--font-jetbrains-mono",
});
export default function App({ Component, pageProps }: AppProps) {

  return (
    <div className={JetBrainsMono.className}>
      <SnackbarProvider>
        <Component {...pageProps} />
      </SnackbarProvider>
    </div>
  );
}
