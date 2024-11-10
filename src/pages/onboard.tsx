import Image from '@/components/Image';
import { auth } from '@/firebase-config';
import { ArrowLeftIcon, ArrowUpCircleIcon, ClockIcon, FaceFrownIcon, UserCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
const descriptions = [
    "Your turn to add something stunning!",
    "Time to make your mark—upload your image and let’s see what kind of masterpiece you’ve got!",
    "Who needs perfection? Just upload and let the magic happen!",
    "It’s your turn to shine! Drop that image and let us bask in your brilliance!",
    "We’re not judging, promise. But, seriously, your photo will totally make us jealous.",
    "You’ve got the idea. We’ve got the wall. Let’s make some Pinterest magic happen!",
    "This wall’s looking a little bare, don’t you think? Add your image and let’s spice things up!",
    "Your wall is calling for an upgrade. Go ahead, make it pop with your creativity!",
    "We’re wide open and waiting for your next masterpiece. What are you going to upload?",
    "The wall is ready, but are *you* ready to leave your mark?",
    "It’s not just any image—it’s *your* image! Bring it to the wall and let’s get inspired!",
    "You didn’t think we were going to leave this wall empty, did you? Upload and show us what you’ve got!",
    "Don’t just sit there—upload that photo and let’s give this wall some personality!",
    "Are you ready to make history? Upload your image and claim your spot on the wall!",
    "We promise no one will judge your photo (okay, maybe a little)—just upload and let’s get started!",
    "This wall's looking for something special. Got a photo? We’ve got a place for it!",
    "Here’s your chance to make the wall *yours*. Upload something epic!",
    "You’ve got the vision, we’ve got the space. Let’s see what you’ve got!",
    "Come on, we know you’ve got a picture that’ll make us all stop scrolling. Upload it!",
    "Think of this wall as a canvas. Your image is the brushstroke. Let’s get creative!"
];

export default function Onboard() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setImagePreview(URL.createObjectURL(uploadedFile));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setImagePreview(URL.createObjectURL(droppedFile));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setFile(null);
        setImagePreview(null);
    };
    // Use useMemo to memoize the random description
    const description = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        return descriptions[randomIndex];
    }, []); // Empty dependency array ensures this is calculated only once

    return (
        <div className="container mx-auto py-0">
            <div className="top-0 sticky mx-auto w-full max-w-6xl bg-white px-4 py-2 md:lg:py-10 rounded-lg shadow-md- flex align-middle content-center">
                <button onClick={() => {
                    if (imagePreview) {
                        enqueueSnackbar('What should we do with the photo attached?', {
                            action: (snackbarId) => <>
                                <button className='p-2 bg-red-800 rounded-md' onClick={() => {
                                    router.push('/');
                                    closeSnackbar(snackbarId);
                                    removeFile();
                                }}>
                                    Discard
                                </button>
                                <button className='ml-4 p-2' onClick={() => { closeSnackbar(snackbarId) }}>
                                    Cancel
                                </button>
                            </>,
                            persist: true,
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left'
                            }
                        });
                    } else router.push('/')
                }} className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border font-medium text-neutral-950 transition-all duration-300 md:lg:hover:w-32">
                    <div className="hidden md:lg:inline-flex md text-black whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-[-10px] group-hover:opacity-100">
                        Go Back
                    </div>
                    <div className="absolute left-3.5">
                        <ArrowLeftIcon
                            width={15}
                            height={15}
                            className="h-5 w-5"
                        />
                    </div>
                </button>
                {/* <div className='mr-6 p-4 cursor-pointer hover:shadow-md hover:outline outline-neutral-100 rounded-full hover:scale-110 duration-100 hover:duration-100'>
                    <ArrowLeftIcon className='w-[2rem] text-black h-[2rem]' />
                </div> */}
                <div className='pt-2 ml-8'><p className='text-lg'>Add to The Wall</p></div>
            </div>
            <div className="mx-auto max-w-6xl bg-white p-4 py-0 rounded-lg shadow-md- grid  gap-y-8 gap-x-8 grid-cols-1 lg:grid-cols-12">

                {/* File Upload Section */}
                <div className="lg:col-span-4 absolute-mb-[60vh] md:lg:static">
                    {/* <label htmlFor="cover-photo" className="block text-md font-medium text-gray-900">
                        Cover photo
                    </label> */}
                    <div
                        className={`relative hover:shadow-lg transform transition-all hover:duration-400 duration-400 animate-squeezeInterval- -[squeeze_0.5s_ease-in-out_infinite_5s] -delay-[5s] mt-2 flex overflow-hidden justify-center rounded-xl border ${isDragging ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300 bg-neutral-100'} transition-colors`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        {imagePreview ? (
                            <div className="">
                                <div className="rounded-lg">
                                    <img src={imagePreview} className="max-h-[60vh] h-auto w-full bg-blend-darken" alt="Preview" />
                                </div>
                                <div className="absolute top-0 right-0 p-4 flex justify-end">
                                    <button onClick={removeFile} className="relative h-8 overflow-hidden rounded-full px-5-py-2.5 text-neutral-500 transition-all duration-300 hover:bg-red-800 hover:text-white hover:ring-2 hover:ring-red-800 hover:ring-offset-2">
                                        <span className="relative">
                                            <XCircleIcon
                                                className="w-8 h-8" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[30rem] sticky-top-0 grid px-4 pt-8 w-full text-center">
                                <div className="mt-[6rem]">
                                    <ArrowUpCircleIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                    <div className="mt-4 text-neutral-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative text-md underline font-bold cursor-pointer"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="inline text-md"> or drag and drop</p>
                                    </div>
                                </div>
                                <p className="text-md text-neutral-600 mt-[12rem] border-t pt-4">We recommend PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-1 border-t-md:lg:border-none"></div>
                <div className={`pb-4 bg-white rounded-lg-shadow-w-screen-h-screen lg:col-span-6 ${file ? 'opacity-100' : 'opacity-30 -pointer-events-none cursor-not-allowed'}`}>
                    {/* <div className='absolute top-50 mx-auto'>
                        Locked
                    </div> */}
                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-xl mb-4 text-black">
                            Description
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
                                {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-md">workcation.com/</span> */}
                                <textarea
                                    id="description" required
                                    name="description" rows={6}
                                    placeholder={description}
                                    autoComplete="username"
                                    className="block flex-1 w-full border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md"
                                    disabled={!file}
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="flex border mt-4 rounded-md shadow-sm ring-1-ring-inset -ring-gray-300 -focus-within:ring-2 -focus-within:ring-inset -focus-within:ring-black">
                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-md">Posting as @{user ? user?.email?.split('@')[0] : '...'}</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-md mb-[5rem] text-neutral-400">
                        We'll always let you know about important changes, but you pick what else you want to hear about.
                    </p>

                    <p className="mt-4 text-md flex content-center align-middle justify-start mb-[5rem] text-black">
                        <ClockIcon className='w-8 h-8 mr-4' /> <span>Photo's people add to The Wall stay up for 20 hours.</span>
                    </p>

                    <div className="mt-6 border-t md:lg:border-none flex fixed left-0 bottom-0 w-screen px-4 py-2 md:lg:relative md:lg:w-full md:lg:p-0 bg-white items-center justify-end gap-x-6">
                        <button onClick={removeFile} className="group group-hover:border relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium text-neutral-950 duration-500">
                            <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                                Cancel
                            </div>
                            <div className="absolute text-2xl translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                                😔
                            </div>
                        </button>
                        <button disabled={!file}
                            type="submit" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110">
                            <span>Post It!</span>
                            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                <div className="relative h-full w-8 bg-white/20" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
