import { useState, memo } from 'react';
import { auth, provider } from "@/firebase-config";
import raw_images from "@/sample-images.json";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/Dialog";
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup } from "firebase/auth";
import Image from '@/components/Image';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

// Helper Component for Placeholder Item
const PlaceholderItem = memo(({ index }: { index: number }) => (
  <div
    key={index}
    style={{ height: 5 * (Math.floor(10 * Math.random()) || 1) + "rem" }}
    className="mb-4 group flex justify-center content-center bg-neutral-200 w-full rounded-lg break-inside-avoid">
    <h1 className="text-2xl text-center my-auto mx-auto">?</h1>
  </div>
));

PlaceholderItem.displayName = 'PlaceholderItem';

const images = raw_images.map(i => i.urls.regular).slice(0, 20);
export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [mobileGrid, setMobileGrid] = useState(true);
  const { open, openModal, closeModal } = useModal();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      enqueueSnackbar('Signed in as: ' + (user.displayName ?? ""));
      router.push('/onboard')
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
        <div className={`md:lg:hidden content-center justify-between -max-w-sm md:lg:max-w-2xl container py-4 px-4 mx-auto w-full flex`}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt='the-wall-logo' src="/the-wall.svg" className="w-[5rem] h-auto" />
          </div>
          <div className="flex content-center">
            <button onClick={openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group">
              <p className='font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text'>Add your photo</p>
            </button>
          </div>
        </div>
      </div>
      <div className='md:lg:border-none block md:lg:hidden border-b w-full mb-2'></div>
      <p className='max-w-sm- md:lg:max-w-2xl px-4 block md:lg:hidden container mb-4 w-full mx-auto text-neutral-600'>Display <a href='#' className='font-bold underline' onClick={() => setMobileGrid(!mobileGrid)}>{mobileGrid ? "Feed" : "Grid"}</a></p>
      <div
        className={`overflow-y-scroll md:lg:overflow-hidden min-h-[100vh] relative p-2 ${mobileGrid ? 'columns-1' : 'columns-2'} gap-y-8 pt-4 md:columns-4 lg:columns-5 xl:columns-6 gap-2 mb-[5rem] md:lg:p-2 md:lg:gap-2`}
      >
        {images.map((src, index) => (
          <Image alt={src} key={src} src={src} index={index} />
        ))}
        <PlaceholderItem index={0} />
        <PlaceholderItem index={1} />
      </div>
      {/* Fixed Footer and Profile Photo */}
      <div className="fixed flex content-center justify-between right-0 z-20 w-auto bottom-[0rem] px-4 py-2 pb-[1rem] h-[5rem] md:lg:h-auto bg-gradient-to-t from-white to-transparent md:lg:bg-none">
        <div className='hidden md:lg:block fixed -z-10 blur-2xl bg-gradient-to-l from-transparent to-white rotate-[70deg] bottom-[-30rem] right-[-10rem] h-[50rem] w-[30rem]'></div>
        <div className="ml-auto max-w-[15rem] hidden md:lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt='the-wall-logo' src="/the-wall.svg" className="w-[15rem] h-auto" />
          <div className="content-center hidden md:lg:flex text-neutral-500 w-full justify-between">
            <button onClick={user ? () => router.push('/onboard') : openModal} className="h-auto my-auto relative inline-flex items-center justify-center p-0.5 mb-2-me-2 overflow-hidden text-md font-large group">
              <p className='font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-400 inline-block text-transparent bg-clip-text'>Add your photo</p>
            </button>
            <a href='#'>Report</a>
          </div>
        </div>
      </div>
      <div className='max-w-sm text-center w-full z-50 mx-auto pb-[1rem] text-neutral-700 text-sm'>
        &copy; The IBA Wall — Made with love by Kabeer
        <div className='mt-2 border-t underline pt-2 text-neutral-500 flex w-full justify-between'>
          <a href='#'>Report</a>
          <a href='#'>Instagram</a>
        </div>
      </div>
    </>
  );
}
