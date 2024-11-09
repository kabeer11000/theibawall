import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center w-full list-inside list-decimal text-2xl font-bold text-center sm:text-center font-[family-name:var(--font-geist-mono)]">
          You caught us with our pants down!
        </div>
        <div className="mt-[-1rem] flex justify-center w-full list-inside list-decimal text-sm text-center sm:text-center font-[family-name:var(--font-geist-mono)]">
          The IBA Wall
          <code className="bg-black/[.05]- ml-2 dark:bg-white/[.06]- px-1-py-0.5 rounded font-semibold">
            Coming Soon
          </code>
          .
        </div>

        <div className="mt-[2rem] flex gap-4 w-full justify-center items-center flex-col-sm:flex-row">
          <a
            className="rounded-sm border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://instagram.com/theibawall"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className="rounded-sm border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://docs.cloud.kabeers.network/theibawall/document.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our Document
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 text-xs hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; The IBA Wall — 2024
        </a>
      </footer>
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen grid grid-cols-3 gap-x-[1rem] gap-y-[1rem] px-[1rem] overflow-hidden">
        {[...new Array(40)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-100 mx-auto w-full my-auto rounded-lg animate-float-up"
            style={{ height: 5 * (Math.floor(10 * Math.random()) || 1) + "rem", animationDelay: `${(i + (Math.floor(10 * Math.random()))) * 0.2}s` }}  // Adjust delay to get the effect you want
          ></div>
        ))}
      </div>
    </div>
  );
}
