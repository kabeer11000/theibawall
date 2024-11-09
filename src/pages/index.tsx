import { useState, useEffect, memo } from 'react';
import localFont from "next/font/local";
import { auth, provider } from "../../firebaseconfig";
import raw_images from "@/sample-images.json";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/Dialog";
import { signInWithPopup } from "firebase/auth";

const JetBrainsMono = localFont({
  src: "./fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Bold.woff2",
  variable: "--font-jetbrains-mono",
});

// Helper Component for Image Item
const ImageItem = ({ src, index }: { src: string, index: number }) => (
  <div key={index} className="mb-8 px-1 -border group bg-white w-full rounded-lg break-inside-avoid">
    {/* Background overlay that appears when hovering over any image */}
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 z-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto- md:lg:group-hover:opacity-90 group-hover:duration-300"></div>
    <div className="z-0- md:lg:group-hover:z-[200] grid grid-cols-1 md:lg:group-hover:scale-125 transition-transform duration-300">
      <img
        src={src}
        alt={`Image ${index + 1}`}
        className="w-full h-auto md:lg:group-hover:outline outline-neutral-200 bg-neutral-100 rounded-md object-cover md:lg:group-hover:rounded-2xl transition-transform duration-300"
      />
      <div className="flex mt-4 pointer-events-none justify-between">
        <p className="text-lg">@kabeerjaffri</p>
        <p className="text-sm text-neutral-500">— 2 hours ago</p>
      </div>
    </div>
    {/* <div className='group-hover:w-[200%] group-hover:h-[200%]'></div> */}
  </div>
);

// Helper Component for Placeholder Item
const PlaceholderItem = memo(({ index }: { index: number }) => (
  <div
    key={index}
    style={{ height: 5 * (Math.floor(10 * Math.random()) || 1) + "rem" }}
    className="mb-4 group flex justify-center content-center bg-neutral-200 w-full rounded-lg break-inside-avoid"
  >
    <h1 className="text-xl text-center my-auto mx-auto">?</h1>
  </div>
));

PlaceholderItem.displayName = 'PlaceholderItem';

export default function Home() {
  const images = raw_images.map(i => i.urls.regular).slice(0, 20);
  const [mobileGrid, setMobileGrid] = useState(true);
  // const [userPhoto, setUserPhoto] = useState(null);
  const { open, openModal, closeModal } = useModal();

  const handleConfirm = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Set user info in state
      // setUser(user);
      // setUserPhoto(user.photoURL);

      alert('Signed in as: ' + (user.displayName ?? ""));
    } catch (error) {
      alert("Error signing in: " + error);
      alert("Something went wrong, please try again.");
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
        onConfirm={handleConfirm} />


      {/* User Profile Photo in the Top Right
        {user && (
          <div className="fixed top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-transparent via-white to-transparent shadow-lg cursor-pointer transition-all ease-in-out duration-300 hover:scale-105">
            <img
              src={userPhoto}
              alt="User Profile"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
        )} */}
      <div style={{
        background: 'rgba(255,255,255,1)', WebkitMaskImage: 'linear-gradient(to bottom,white 40%,transparent)',
        maskImage: 'linear-gradient(to bottom,white,transparent)',
      }} className='z-20 backdrop-blur-sm sticky top-0'>
        <div className={`${JetBrainsMono.variable} md:lg:hidden content-center justify-between -max-w-sm md:lg:max-w-2xl container py-4 px-4 mx-auto w-full flex ${JetBrainsMono.variable}`}>
          <div>
            <img src="/the-wall.svg" className="w-[5rem] h-auto" />
          </div>
          <div className="flex content-center">
            <button onClick={openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group">
              <p className='font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text'>Add your photo</p>
            </button>
          </div>
        </div>
      </div>
      <div className='md:lg:border-none block md:lg:hidden border-b w-full mb-2'>
      </div>
      <p className='max-w-sm- md:lg:max-w-2xl px-4 block md:lg:hidden container mb-4 w-full mx-auto text-neutral-600'>Display <a href='#' className='font-bold underline' onClick={() => setMobileGrid(!mobileGrid)}>{mobileGrid ? "Feed" : "Grid"}</a></p>
      <div
        className={`overflow-y-scroll md:lg:overflow-hidden min-h-[100vh] relative p-2 ${mobileGrid ? 'columns-1' : 'columns-2'} gap-y-8 pt-4 md:columns-4 lg:columns-5 xl:columns-6 gap-2 mb-[5rem] md:lg:p-2 md:lg:gap-2`}
      >
        {/* <div className='md:lg:mb-10 h-[5rem] w-full hidden md:lg:block'></div> */}
        {images.map((src, index) => (
          <ImageItem key={src} src={src} index={index} />
        ))}
        <PlaceholderItem index={0} />
        <PlaceholderItem index={1} />
        {/* <div className='md:lg:mt-10 h-full w-full hidden md:lg:block'></div> */}
      </div>
      {/* Fixed Footer and Profile Photo */}
      <div className="fixed flex content-center justify-between right-0 z-20 w-screen bottom-[0rem] px-4 py-2 pb-[2rem] h-[5rem] md:lg:h-auto bg-gradient-to-t from-white to-transparent md:lg:bg-none">
        <div className='hidden md:lg:block fixed -z-10 blur-2xl bg-gradient-to-l from-transparent to-white rotate-[70deg] bottom-[-30rem] right-[-10rem] h-[50rem] w-[30rem]'></div>
        <div className="ml-auto max-w-[15rem] hidden md:lg:block">
          <img src="/the-wall.svg" className="w-[15rem] h-auto" />
          <div className="content-center hidden md:lg:flex text-neutral-500 w-full justify-between">
            <button onClick={openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group">
              <p className='font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text'>Add your photo</p>
            </button>

            <a href='#'>Report</a>
            {/* <button onClick={openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large text-black rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <strong>Add your photo</strong>
              </span>
            </button> */}
          </div>

          {/* <div className='mt-[-0.5rem] text-neutral-500 flex w-full justify-between'>
            <a href='#'>Report</a>
            <a href='#'>Instagram</a>
          </div> */}
        </div>
      </div>
      <div className='max-w-sm text-center w-full mx-auto pb-[1rem] text-neutral-700 text-sm'>
        &copy; The IBA Wall — Made with love by Kabeer
      </div>
    </>
  );
}
