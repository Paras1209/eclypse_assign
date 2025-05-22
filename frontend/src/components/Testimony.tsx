import React, {useState} from 'react'
// import ReactDOM from 'react-dom'

interface Testimonial {
      text: string;
      name: string;
      location: string;
      imgAlt: string;
      imgSrc: string;
    }

    const testimonials: Testimonial[] = [
      {
        text: "Understated, but unforgettable. It feels like it was made for me",
        name: "Random Woman",
        location: "NY, USA",
        imgAlt: "Portrait of a woman playing a cello, wearing a black outfit, brown background",
        imgSrc: "https://storage.googleapis.com/a1aa/image/9a1a7e61-c1dc-4ae1-0041-a1bea891c51f.jpg",
      },
      {
        text: "A truly transformative experience, I can't recommend it enough.",
        name: "Random Man",
        location: "CA, USA",
        imgAlt: "Portrait of a man with glasses, dark background, grayscale style",
        imgSrc: "https://storage.googleapis.com/a1aa/image/e1839cf0-defa-4afb-af46-881e08a81fd8.jpg",
      },
      {
        text: "Exceptional quality and service, exceeded all my expectations.",
        name: "Random Blonde",
        location: "TX, USA",
        imgAlt: "Portrait of a woman with blonde hair, dark background, grayscale style",
        imgSrc: "https://storage.googleapis.com/a1aa/image/188e9ef7-d8a9-4204-2062-896c839b3a28.jpg",
      },
    ];
    
function Testimony() {
  const [currentIndex, setCurrentIndex] = useState(0);

      const handleSelect = (index: number) => {
        setCurrentIndex(index);
      };

      const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      };

      return (
        <div className="flex relative w-full">
          <div className="flex-1  md:pr-8">
            <p className=" text-lg text-gray-400 tracking-widest mb-8">
              OUR CUSTOMERS
            </p>
            <blockquote className="text-white text-2xl sm:text-5xl font-normal leading-snug max-w-lg sm:max-w-3xl flex items-start my-24 py-6">
                <svg className="text-white h-16 w-16 sm:h-28 sm:w-24 mr-6 -mt-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              {testimonials[currentIndex].text}
            </blockquote>
            <div className="mt-6 sm:mt-8">
              <p className="text-white text-base sm:text-xl font-normal ml-16">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-gray-600 text-[10px] sm:text-lg mt-2 ml-16">
                {testimonials[currentIndex].location}
              </p>
            </div>
          </div>
          <div
            className="flex flex-col items-center space-y-5 absolute top-1/2 -translate-y-1/2 right-0 md:right-0"
          >
            <button
              aria-label="Previous testimonial"
              onClick={handlePrev}
              className="text-white text-xl sm:text-2xl"
            >
              <svg className="h-5 w-5 sm:h-10 sm:w-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <i className="fas fa-chevron-left"></i>
            </button>
            {testimonials.map((t, i) => (
              <img
                key={i}
                alt={t.imgAlt}
                src={t.imgSrc}
                onClick={() => handleSelect(i)}
                className={`cursor-pointer rounded-full border-2 border-transparent object-cover transition-all duration-300 ${
                  i === currentIndex
                    ? "border-white " + (i === 0 ? "w-16 h-16 sm:w-25 sm:h-25" : "w-16 h-16 sm:w-25 sm:h-25")
                    : "opacity-40 " + (i === 0 ? "w-12 h-12 sm:w-15 sm:h-15" : "w-12 h-12 sm:w-15 sm:h-15")
                }`}
                width={i === 0 ? (i === currentIndex ? 80 : 60) : 60}
                height={i === 0 ? (i === currentIndex ? 80 : 60) : 60}
              />
            ))}
          </div>
        </div>
      );
}

export default Testimony
