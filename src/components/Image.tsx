import { useRouter } from "next/router";
import { memo } from "react";
export const Skeleton = () => {
    return (
        <div className="-mb-4 a-bsolute px-1 -border group bg-white w-full rounded-lg break-inside-avoid">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 z-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto- md:lg:group-hover:opacity-90 group-hover:duration-300"></div>
            <div className="z-0 grid grid-cols-1">
                <div className="w-full h-64 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="flex mt-4 pointer-events-none justify-between">
                    <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                </div>
                <p className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm text-neutral-500 bg-gray-300 w-20 h-4 animate-pulse"></p>
            </div>
        </div>
    );
};

const Image = memo((props: { src: string, id: string, index: number, [x: string]: unknown }) => {
    const { index, src, id } = props;
    const router = useRouter();
    // const [hovering, setHovering] = useState<boolean>(false);
    return (
        <div key={index} onClick={() => router.push('/@' + id)}
            className="mb-4 px-1 cursor-pointer -border group bg-white w-full rounded-lg break-inside-avoid">
            {/* {loading && <Skeleton />} */}
            <div>
                {/* Background overlay that appears when hovering over any image */}
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 z-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto- md:lg:group-hover:opacity-90 group-hover:duration-300"></div>
                <div className="z-0- overflow-hidden md:lg:group-hover:z-[50] grid grid-cols-1 md:lg:group-hover:scale-125 transition-all duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        {...props} src={src}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto md:lg:group-hover:outline outline-neutral-200 bg-neutral-100 rounded-md object-cover md:lg:group-hover:rounded-2xl transition-all duration-300"
                    />
                    <div className="flex mt-4 pointer-events-none justify-between">
                        <p className="text-md">@kabeerjaffri</p>
                    </div>
                    {/* <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' /> */}
                    <p className="opacity-0 md:lg:group-hover:opacity-100 transition-all duration-300 text-sm text-neutral-500">2 hours ago</p>
                    {/* <div className="animate-squeeze hidden bg-white border rounded-full group-hover:grid transition-all duration-300 text-2xl p-2 pb-0 align-middle grid-cols-6 gap-4">
                        <p>😭</p>
                        <p>😂</p>
                        <p>👏</p>
                        <p>👍</p>
                        <p>👎</p>
                        <p>❤️</p>
                    </div> */}
                </div>
                {/* <div className='group-hover:w-[200%] group-hover:h-[200%]'></div> */}
            </div>
        </div>
    )
});
Image.displayName = 'Image';
export default Image;