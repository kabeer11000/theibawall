import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { SnackbarProvider } from "notistack";
import { system } from "@chakra-ui/react/preset";
const JetBrainsMono = localFont({
  src: "./fonts/nimbus-sans-l/NimbusSanL-Reg.otf",
  // src: "./fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Bold.woff2",
  variable: "--font-jetbrains-mono",
});
export default function App({ Component, pageProps }: AppProps) {

  return (
    <div className={JetBrainsMono.className}>
      {/* <ThemeProvider> */}
        <ChakraProvider value={system}>
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>
        </ChakraProvider>
      {/* </ThemeProvider> */}
    </div>
  );
}
