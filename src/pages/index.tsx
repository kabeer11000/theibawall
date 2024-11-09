import { useState, useEffect } from 'react';
import localFont from "next/font/local";
import { auth, provider } from "../../firebaseconfig";
import raw_images from "@/sample-images.json";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/Dialog";
import { signInWithPopup } from "firebase/auth";

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

// Helper Component for Image Item
const ImageItem = ({ src, index }: { src: string, index: number }) => (
  <div key={index} className="mb-4 group bg-white w-full rounded-lg break-inside-avoid">
    {/* Background overlay that appears when hovering over any image */}
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 z-100 transition-opacity duration-300 pointer-events-none md:lg:group-hover:opacity-90 group-hover:duration-300"></div>
    <div className="z-0- md:lg:group-hover:z-[200] grid grid-cols-1 md:lg:group-hover:scale-125 transition-transform duration-300">
      <img
        src={src}
        alt={`Image ${index + 1}`}
        className="w-full h-auto bg-neutral-100 rounded-lg object-cover"
      />
      <div className="flex justify-between">
        <p className="text-lg">@kabeerjaffri</p>
        <p className="text-sm text-neutral-500">— 2 hours ago</p>
      </div>
    </div>
  </div>
);

// Helper Component for Placeholder Item
const PlaceholderItem = ({ index }: { index: number }) => (
  <div
    key={index}
    style={{ height: 5 * (Math.floor(10 * Math.random()) || 1) + "rem" }}
    className="mb-4 group flex justify-center content-center bg-neutral-200 w-full rounded-lg break-inside-avoid"
  >
    <h1 className="text-xl text-center my-auto mx-auto">?</h1>
  </div>
);

export default function Home() {
  const images = raw_images.map(i => i.urls.regular).slice(0, 20);
  // const [user, setUser] = useState(null);
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
      <div
        className={`${geistSans.variable} overflow-y-scroll md:lg:overflow-hidden min-h-[100vh] relative ${geistMono.variable} p-2 columns-2 gap-y-0 md:columns-4 lg:columns-6 xl:columns-7 gap-2 mb-[5rem] md:lg:p-2 md:lg:gap-2`}
      >
        {images.map((src, index) => (
          <ImageItem key={index} src={src} index={index} />
        ))}
        {[...new Array(2)].map(index => (
          <PlaceholderItem key={index} index={index} />
        ))}

        {/* Fixed Footer and Profile Photo */}
        <div className="fixed flex content-center justify-between right-0 z-20 w-screen bottom-[0rem] px-2 py-2 pb-[1rem] h-[5rem]" style={{ background: 'linear-gradient(to top,white, white, transparent)' }}>
          <div className="flex content-center">
            <button onClick={openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large text-black rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <strong>Add your photo</strong>
              </span>
            </button>
          </div>
          <div className="ml-auto max-w-[10rem]">
            <img src="/the-wall.svg" className="w-[10rem] h-auto"/>
            <div className='mt-[-0.5rem] text-neutral-500 flex w-full justify-between'>
              <a href='#'>Report</a>
              <a href='#'>Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
