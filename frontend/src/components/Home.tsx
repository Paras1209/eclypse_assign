import React from 'react'

function Home() {
    return (
        <div className="pt-12 bg-[#0a0a0a] "> {/* Added padding-top to account for navbar height */}
            {/* Hero section */}
            <div>
                <section className=" text-white min-h-screen w-full mt-20 p-12 pb-0">
                    <div className="flex justify-between  place-items-end pb-7 pt-4 ">
                        <img src="src/assets/Hero_header.png" alt="Eclypse Logo" className="h-32" />
                        <span className="text-sm font-bold">© 2025</span>
                    </div>

                    {/* Video Section */}
                    <div className="relative w-full overflow-hidden aspect-video">
                        <video
                            className="absolute top-1 left-0 w-full h-3/4 object-cover rounded-md"
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source src="src/assets/hero_section.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Text Caption over Video */}
                        <div className="absolute bottom-50 right-8 text-white z-10 font-['Helvetica_Neue'] font-normal text-[34px] leading-[41px] tracking-[-0.02em] max-w-md text-right">
                            A silhouette worth remembering
                        </div>
                    </div>
                </section>
            </div>

            {/* sub header */}
            <div className='text-white p-12 w-2/3 pt-0'>
                <h2 className="font-['sans-serif'] font-normal text-[48px] leading-[58px] tracking-[-0.02em] w-[800px] mb-20">Rooted in a philosophy of quiet luxury, our garments are designed to speak softly in cut, in movement, in presence.</h2>
            </div>
        </div>
    )
}

export default Home