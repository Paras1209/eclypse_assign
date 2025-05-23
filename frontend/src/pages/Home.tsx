import ProductDetails from "../components/ProductDetails";
import Testimony from "../components/Testimony";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="pt-12 bg-[#0a0a0a] overflow-scroll hide-scrollbar">
      {/* Hero section */}      <div>
        <section className="text-white min-h-screen w-full mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 md:px-12 pb-0">
          <div className="flex justify-between place-items-end pb-4 sm:pb-7 pt-4">
            <img
              src="src/assets/Hero_header.png"
              alt="Eclypse Logo"
              className="h-16 sm:h-24 md:h-32"
            />
            <span className="text-xs sm:text-sm font-bold">© 2025</span>
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
            <div className="absolute bottom-6 sm:bottom-12 md:bottom-50 right-4 sm:right-8 text-white z-10 font-['Helvetica_Neue'] font-normal text-xl sm:text-2xl md:text-[34px] leading-tight sm:leading-[41px] tracking-[-0.02em] max-w-[200px] sm:max-w-[300px] md:max-w-md text-right">
              A silhouette worth remembering
            </div>
          </div>
        </section>
      </div>

      {/* sub header */}
      <div className="text-white px-4 sm:px-6 md:px-12 w-full md:w-5/6 lg:w-2/3 pt-0">
        <h2 className="font-['sans-serif'] font-normal text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-snug md:leading-[58px] tracking-[-0.02em] max-w-full lg:max-w-[800px] mb-10 sm:mb-16 md:mb-20">
          Rooted in a philosophy of quiet luxury, our garments are designed to
          speak softly in cut, in movement, in presence.
        </h2>
      </div>

      {/* brand overview grid */}
    <div className="min-h-screen p-12 mb-10">

        <div className="grid grid-cols-3 gap-8 w-full">
            <div className="col-span-2 overflow-hidden rounded-lg h-50% relative group">
                <video
                    muted
                    loop
                    autoPlay
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                    <source src="src/assets/eclypse.mp4" type="video/mp4" />
                    Your browser does not support the video tag.

                </video>
                {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex  items-end p-4">
                    <p className="text-white text-lg font-medium">Eclypse Collection</p>
                </div> */}
            </div>

            {/* Top-right image */}
            <div className="overflow-hidden rounded-lg h-120 relative group">
                <img
                    src="src/assets/grid1.jpg"
                    alt="Image 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay with text */}
                <div className="absolute inset-0 bg-gray-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pb-10">
                    <p className="text-white text-4xl font-medium">Premium wool blend in signature vermilion</p>
                </div>
            </div>
            {/* Bottom-left image */}
            <div className="overflow-hidden rounded-lg h-100 relative group">
                <img
                    src="src/assets/grid2.jpg"
                    alt="Image 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay with text that appears on hover */}
                <div className="absolute inset-0 bg-gray-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pb-10">
                    <p className="text-white text-4xl font-medium">Discrete side pockets with clean finish</p>
                </div>
            </div>

            {/* Bottom-middle image */}
            <div className="overflow-hidden rounded-lg h-100 relative group">
                <img
                    src="src/assets/grid3.jpg"
                    alt="Image 3"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay with text that appears on hover */}
                <div className="absolute inset-0 bg-gray-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pb-10">
                    <p className="text-white text-4xl font-medium">Hand-cut and assembled in small batches</p>
                </div>
            </div>

            {/* Bottom-right image */}
            <div className="overflow-hidden rounded-lg h-100 relative group">
                <img
                    src="src/assets/logo.jpg"
                    alt="Image 4"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* overlaying image */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <img 
                        src="src/assets/Hero_header.png" 
                        alt="Eclypse Logo" 
                        className="w-2/3 mx-auto"
                    />
                </div>
            </div>
        </div>
    </div>

    <div className="mb-10">
      <ProductDetails />
    </div>

    {/* testimonials */}
    <div className="p-10 m-10">
      <Testimony />
    </div>

    {/* Footer */}
    <footer><Footer/></footer>

    </div>
  );
}

export default Home;