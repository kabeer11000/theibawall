import { useState, memo, useMemo } from "react";
import { auth, provider } from "@/firebase-config";
import raw_images from "@/sample-images.json";
import fs from "fs";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/Dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import Image from "@/components/Image";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

// Memoized PlaceholderItem component to prevent unnecessary re-renders
const PlaceholderItem = memo(({ height }: { height: string }) => (
  <div
    style={{ height }}
    className="mb-4 group flex justify-center content-center bg-neutral-200 w-full rounded-lg break-inside-avoid"
  >
    <h1 className="text-2xl text-center my-auto mx-auto">?</h1>
  </div>
));

PlaceholderItem.displayName = "PlaceholderItem";
export interface IImage {
  thumbnail: {
    url: string, sizes: {
      0: number,
      1: number,
      2: number,
      3: string,
      bits: number,
      mime: string
    }
  },
  original: {
    url: string, sizes: {
      0: number,
      1: number,
      2: number,
      3: string,
      bits: number,
      mime: string
    }
  },
  small: {
    url: string, sizes: {
      0: number,
      1: number,
      2: number,
      3: string,
      bits: number,
      mime: string
    }
  },
  medium: {
    url: string, sizes: {
      0: number,
      1: number,
      2: number,
      3: string,
      bits: number,
      mime: string
    }
  },
  large: {
    url: string, sizes: {
      0: number,
      1: number,
      2: number,
      3: string,
      bits: number,
      mime: string
    }
  }
}
const images = raw_images.slice(0, 15) as Array<IImage>; //raw_images.map(i => i.urls.regular).slice(0, 20);

// Generate random heights for placeholders once
const generateRandomHeights = () => {
  const heights = [];
  for (let i = 0; i < 2; i++) {
    heights.push(`${5 * (Math.floor(10 * Math.random()) || 1)}rem`);
  }
  return heights;
};

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [mobileGrid, setMobileGrid] = useState(false);
  const { open, openModal, closeModal } = useModal();
  const { enqueueSnackbar } = useSnackbar();

  // Memoize random heights for placeholders
  const randomHeights = useMemo(generateRandomHeights, []);

  const handleConfirm = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      enqueueSnackbar("Signed in as: " + (user.displayName ?? ""));
      router.push("/onboard");
    } catch (error) {
      enqueueSnackbar("Error signing in: " + error);
    }
  };

  return (
    <>
      <Modal
        isOpen={open}
        onClose={closeModal}
        title="Join the IBA Wall!"
        description="We'd love to feature your photo, but first, sign in to add to the wall."
        confirmText="🚀 Sign in with Google"
        cancelText="Maybe Later"
        onConfirm={handleConfirm}
      />

      <div
        style={{ background: "rgba(255,255,255,1)" }}
        className="shadow- z-20 backdrop-blur-sm sticky top-0"
      >
        <div
          className={`md:lg:hidden content-center justify-between -max-w-sm md:lg:max-w-2xl container py-4 px-4 mx-auto w-full flex`}
        >
          <div>
            <img
              alt="the-wall-logo"
              src="/the-wall.svg"
              className="w-[5rem] h-auto"
            />
          </div>
          <div className="flex content-center">
            <button
              onClick={user ? () => router.push("/onboard") : openModal}
              className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group"
            >
              <p className="font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text">
                Add your photo
              </p>
            </button>
          </div>
        </div>
      </div>

      <p className="max-w-sm- md:lg:max-w-2xl px-4 block md:lg:hidden container mb-4 w-full mx-auto text-neutral-600">
        Display{" "}
        <a
          href="#"
          className="font-bold underline"
          onClick={() => setMobileGrid(!mobileGrid)}
        >
          {mobileGrid ? "Feed" : "Grid"}
        </a>
      </p>

      <div
        className={`overflow-y-scroll md:lg:overflow-hidden min-h-[100vh] relative p-2 ${mobileGrid ? "columns-1" : "columns-2"} gap-y-8 pt-4 md:columns-4 lg:columns-5 xl:columns-6 gap-2 mb-[5rem] md:lg:p-2 md:lg:py-4 md:lg:gap-2`}
      >
        {images.map((src, index) => (
          <Image key={src.large.url} src={src} id={"kabeerjaffri"} index={index} />
        ))}
        {/* Use pre-generated heights for PlaceholderItems */}
        {randomHeights.map((height, index) => (
          <PlaceholderItem key={index} height={height} />
        ))}
      </div>

      <div className="fixed hidden md:lg:flex content-center justify-between right-0 z-20 w-auto bottom-[0rem] px-4 py-2 pb-[1rem] h-[5rem] md:lg:h-auto bg-gradient-to-t from-white to-transparent md:lg:bg-none">
        <div className="fixed -z-10 blur-2xl bg-gradient-to-l from-transparent to-white rotate-[70deg] bottom-[-30rem] right-[-10rem] h-[50rem] w-[30rem]"></div>
        <div className="ml-auto max-w-[15rem] hidden md:lg:block">
          <img
            alt="the-wall-logo"
            src="/the-wall.svg"
            className="w-[15rem] h-auto"
          />
          <div className="content-center hidden md:lg:flex text-neutral-500 w-full justify-between">
            <button
              onClick={user ? () => router.push("/onboard") : openModal}
              className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group"
            >
              <p className="font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text">
                Add your photo
              </p>
            </button>
            <a href="#">Report</a>
          </div>
        </div>
      </div>

      <div className="max-w-sm text-center w-full z-50 mx-auto pb-[1rem] text-neutral-700 text-sm">
        &copy; The IBA Wall — Made with love by Kabeer
        <div className="mt-2 border-t underline pt-2 text-neutral-500 flex w-full justify-between">
          <a href="#">Report</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </>
  );
}

// export const getServerSideProps = () => {
//   const urls = [];
//   if (!fs.existsSync('/Users/0x/Documents/Software/thewall/web/public/urls.json')) {
//     const 
//   }
//   return ({
//     props: {
//       dataURLs: []
//     }
//   })
// }