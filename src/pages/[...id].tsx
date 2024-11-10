import { useEffect, useState } from "react";
import router from "next/router";
import sampleResponse from "@/sample-images.json";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export const getServerSideProps = () => {
    return {
        props: {
            data: sampleResponse[0]
        }
    };
}

const MapEmbed = ({ width, height, zoom, latitude, longitude }) => {
    const src = `https://www.openstreetmap.org/export/embed.html?zoom=${zoom}&bbox=${longitude - 0.02
        },${latitude - 0.01},${longitude + 0.02},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

    return (
        <iframe
            style={{ width: width, height: height, border: 0 }}
            frameBorder="0"
            src={src}
            allowFullScreen
            title="OpenStreetMap Embed"
        ></iframe>
    );
};

export const Pin = ({ data }) => {
    const [imageScale, setImageScale] = useState(1);

    // Adjust the image scale on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const newScale = Math.max(0.7, 1 - scrollPosition / 500); // Shrink to 70% max
            setImageScale(newScale);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="container mx-auto py-4">
            <div className="mx-auto relative mt-4 max-w-6xl bg-white p-4 -shadow-lg rounded-xl">
                {/* Go Back Button */}
                <div className="w-full rounded-xl py-2 bg-neutral-100 z-50">
                    <button
                        onClick={() => router.push('/')} className="z-50 ml-4 mt-4 group absolute inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border font-medium text-neutral-950 transition-all duration-300 md:lg:hover:w-32">
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
                    {/* Image with Scaling Effect */}
                    <img
                        style={{ transform: `scale(${imageScale})` }}
                        className="rounded-xl mx-auto transition-transform duration-300 ease-in-out w-full max-w-[30rem] h-auto border"
                        src="https://images.unsplash.com/photo-1682957396576-26388c4a175a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxhbGx8NTJ8fHx8fHx8fDE3MzEwNDk0NjF8&ixlib=rb-4.0.3&q=80&w=1080"
                        alt="Sample Image"
                    />
                </div>

                {/* Description and Map Embed */}
                <div className="my-8">
                    <p className="text-2xl font-semibold">{'@kabeerjaffri'}</p>
                    <p className="text-sm text-neutral-500">{'About 2 hours ago near G&T'}</p>
                    <p className="text-lg mt-4 text-black">
                        Here's how you can translate this into React, utilizing props for width, height, zoom, longitude, and latitude for easy customization. This will also remove inline styling by using the style attribute in JSX:
                    </p>
                </div>

                <div className="w-full mt-4 overflow-hidden rounded-xl">
                    <MapEmbed width="100%" height="20rem" zoom={1} latitude={24.94103} longitude={67.11393} />
                </div>
            </div>
        </div>
    );
}

export default Pin;
