import { auth } from '@/firebase-config';
import descriptions from '@/utils/descriptions';
import { ArrowLeftIcon, ArrowUpCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Onboard() {
    const [file, setFile] = useState<null | File>(null);
    const [imagePreview, setImagePreview] = useState<null | string>(null);
    const [locationName, setLocationName] = useState<null | string>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    type DragEvent = React.DragEvent<HTMLDivElement>;
    type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;

    const handleFileChange = (e: FileChangeEvent): void => {
        const uploadedFile = e.target?.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setImagePreview(URL.createObjectURL(uploadedFile));
        }
    };

    const handleDrop = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setImagePreview(URL.createObjectURL(droppedFile));
        }
    };

    const handleDragOver = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (): void => {
        setIsDragging(false);
    };

    const removeFile = (): void => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setFile(null);
        setImagePreview(null);
    };
    const [location, setLocation] = useState<null | string>(null);

    // Use useMemo to memoize the random description
    const description = useMemo<string>(() => {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        return descriptions[randomIndex];
    }, []); // Empty dependency array ensures this is calculated only once
    const handleLocation = () => {
        // let options;
        // if (window?.chrome) //set this var looking for Chrome un user-agent header
        //     options = { enableHighAccuracy: false, maximumAge: 15000, timeout: 30000 };
        // else
        //     options = { maximumAge: Infinity, timeout: 0 };
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(async (position) => {
            setLocation(position.coords.latitude + ', ' + position.coords.longitude);
            setLocationName((await (await fetch(`https://docs.cloud.kabeers.network/tests/wall/location.php?lat=${position.coords.latitude}&long=${position.coords.longitude}&cache=${Math.random()}`)).json()).data.placeName);
        }, console.log, window.chrome ? { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 } : { enableHighAccuracy: true, maximumAge: Infinity, timeout: 0 })
    }
    useEffect(() => {
        handleLocation();
    }, [file]);
    return (
        <div className="overflow-hidden relative container mx-auto py-0">
            <div className="top-0 z-50 border-b md:lg:border-none sticky mx-auto w-full max-w-6xl -bg-white px-4 py-2 md:lg:py-10 rounded-lg shadow-md- flex align-middle content-center">
                <button onClick={() => {
                    if (imagePreview) {
                        enqueueSnackbar('What should we do with the photo attached?', {
                            action: (snackbarId) => <>
                                <button className='p-4 bg-red-800 rounded-2xl' onClick={() => {
                                    router.push('/');
                                    closeSnackbar(snackbarId);
                                    removeFile();
                                }}>
                                    Discard
                                </button>
                                <button className='ml-4 p-4' onClick={() => { closeSnackbar(snackbarId) }}>
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
            <form action={async (formData) => {
                // Ensure file exists
                if (!file) {
                    console.error("No file provided for upload.");
                    return;
                }

                formData.append('file', file);
                formData.append('location-coord', location || '');  // Fallback to empty string if location is null or undefined
                formData.append('location', locationName || '');    // Fallback to empty string if locationName is null or undefined

                // Retrieve user token
                let userToken;
                try {
                    userToken = (await user?.getIdToken())?.toString();
                    if (!userToken) {
                        console.error("Failed to retrieve user token.");
                        return;
                    }
                    formData.append('token', userToken);
                } catch (error) {
                    console.error("Error while retrieving user token:", error);
                    return;
                }

                // Get API token from server
                let apiToken;
                try {
                    const response = await fetch(`/api/get-token?user=${encodeURIComponent(user?.email?.split('@')[0] || '')}`);
                    if (!response.ok) {
                        console.error("Failed to fetch API token:", response.status, response.statusText);
                        return;
                    }
                    apiToken = await response.text();
                } catch (error) {
                    console.error("Error fetching API token:", error);
                    return;
                }

                // Verify API token exists
                if (!apiToken) {
                    console.error("API token is empty or undefined.");
                    return;
                }

                // Upload file to API
                try {
                    const uploadResponse = await fetch(`https://docs.cloud.kabeers.network/tests/wall/api.php?token=${apiToken}&is-live=false&cache=${Math.random()}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!uploadResponse.ok) {
                        console.error("File upload failed:", uploadResponse.status, uploadResponse.statusText);
                        return;
                    }

                    // Optionally, handle response data
                    const result = await uploadResponse.json();
                    console.log("File uploaded successfully:", result);

                } catch (error) {
                    console.error("Error during file upload:", error);
                }
            }} method='post' encType="multipart/form-data" className="mx-auto mt-4 max-w-6xl bg-white- p-4 py-0 rounded-lg shadow-md- grid  gap-y-8 gap-x-8 grid-cols-1 lg:grid-cols-12">

                {/* File Upload Section */}
                <div className="lg:col-span-4 absolute-mb-[60vh] md:lg:static">
                    <div className='mx-auto flex w-full justify-center md:lg:block'>
                        <div
                            className={`relative hover:shadow-lg transform transition-all hover:duration-400 duration-400 animate-squeezeInterval- -[squeeze_0.5s_ease-in-out_infinite_5s] -delay-[5s] mt-2 flex overflow-hidden justify-center rounded-xl border ${isDragging ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300 bg-neutral-100'} transition-colors`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {imagePreview ? (
                                <div className="mx-auto">
                                    <div className="rounded-lg">
                                        <img src={imagePreview} className="max-h-[40vh] md:lg:max-h-[60vh] h-full w-auto md:lg:h-auto md:lg:w-full bg-blend-darken" alt="Preview" />
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
                                                <input required
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file" accept='image/*'
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="inline text-md"> or drag and drop</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-400 mt-[12rem] border-t pt-4">We recommend PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-1 border-t-md:lg:border-none"></div>
                <div className={`pb-4 -bg-white  rounded-lg-shadow-w-screen-h-screen lg:col-span-6 ${file ? 'opacity-100' : 'opacity-30 pointer-events-none cursor-not-allowed'}`}>
                    {/* <div className='absolute top-50 mx-auto'>
                        Locked
                    </div> */}
                    <div className="sm:col-span-4">
                        <label htmlFor="description" className="block text-md mb-4 text-black">
                            Description
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-2xl shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
                                {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-md">workcation.com/</span> */}
                                <textarea
                                    id="description" required
                                    name="description" rows={6}
                                    placeholder={description}
                                    className="block flex-1 w-full border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md"
                                    disabled={!file}
                                />
                            </div>
                        </div>
                        <label htmlFor="link" className="mt-8 block text-md mb-4 text-black">
                            Link *
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-2xl shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
                                {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-md">workcation.com/</span> */}
                                <input
                                    id="link" required
                                    name="link" placeholder='https://supercoolwebsite.com' type='text'
                                    className="block flex-1 w-full border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md"
                                    disabled={!file}
                                />
                            </div>
                        </div>

                        <label htmlFor="link" className="mt-8 block text-md mb-4 text-black">
                            Location *
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-2xl shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
                                {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-md">workcation.com/</span> */}
                                <input
                                    id="location" required
                                    name="location" placeholder='G&T Auditorium' value={(locationName && location !== 'loading') ? locationName : ''} type='text'
                                    className="block flex-1 w-full border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-md"
                                    disabled={true}
                                />

                                {/* <button disabled={!file} onClick={handleLocation} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl text-neutral-950 px-4 pt-2 font-medium -text-neutral-200 transition hover:scale-110">
                                    <span>{location === 'loading' ? 'Loading...' : 'Fetch'}</span>
                                </button> */}

                            </div>
                        </div>
                        <div className='none hidden'>
                            <input type='text' name='user' required value={user ? user?.email?.split('@')[0] : ''} />
                        </div>

                        <div className="my-4">
                            <div className="flex mt-4 rounded-2xl -shadow-sm ring-1-ring-inset -ring-gray-300 -focus-within:ring-2 -focus-within:ring-inset -focus-within:ring-black">
                                <span className="flex select-none items-center -pl-3 text-black sm:text-md">Posting as{' '}<strong className='ml-2'>@{user ? user?.email?.split('@')[0] : '...'}</strong></span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-md flex content-center align-middle justify-start mb-[5rem] text-black">
                        <ClockIcon className='w-8 h-8 mr-4' /> <span>Photo&apos;s people add to The Wall stay up for 20 hours.</span>
                    </p>

                    <div className="mt-6 border-t md:lg:border-none flex fixed left-0 bottom-0 w-screen px-4 py-2 md:lg:relative md:lg:w-full md:lg:p-0 bg-white md:lg:bg-transparent items-center justify-end gap-x-6">
                        <button onClick={removeFile} className="group group-hover:border relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 font-medium text-neutral-950 duration-500">
                            <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                                Cancel
                            </div>
                            <div className="absolute text-2xl translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                                😔
                            </div>
                        </button>
                        <button disabled={!file}
                            type="submit" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110">
                            <span>Post It!</span>
                            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                <div className="relative h-full w-8 bg-white/20" />
                            </div>
                        </button>
                    </div>
                </div>
            </form>
            <div className='absolute -z-10 left-[5rem] bottom-[5rem]'>
                <div className='w-screen max-w-sm'>
                    <svg width="658" height="721" viewBox="0 0 658 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M313.898 0.138454C417.937 0.31296 493.477 87.8141 556.938 170.257C618.576 250.331 671.906 342.239 653.752 441.645C634.738 545.766 559.193 629.515 464.451 676.703C368.025 724.729 252.828 739.006 157.518 688.801C65.5175 640.338 22.1754 537.143 4.86437 434.61C-11.075 340.201 14.3373 247.461 69.833 169.44C130.212 84.5528 209.728 -0.0362725 313.898 0.138454Z" fill="#F3F3F3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
