import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] py-25 px-6 md:px-15 flex flex-col md:flex-row  items-start relative border-t border-[#222222] ">
          <div className="flex flex-col space-y-10 md:space-y-10 max-w-xs">
            <div className="flex items-center space-x-1">
              <h1 className="text-white text-4xl font-normal leading-none tracking-tight m-3">Eclypse</h1>
              <i className="fas fa-external-link-alt text-white text-xs"></i>
            </div>
            <nav className="flex flex-wrap gap-x-3 gap-y-2 text-white text-sm font-normal leading-tight">
              <a href="#" className="hover:underline">Home</a>
              <span>/</span>
              <a href="#" className="hover:underline">About</a>
              <span>/</span>
              <a href="#" className="hover:underline">Buy</a>
              <div className="w-full "></div>
              <a href="#" className="hover:underline">Our Customers</a>
              <span>/</span>
              <div className="w-full"></div>
              <a href="#" className="hover:underline">Contacts</a>
            </nav>
          </div>
          
          <div className="flex flex-col space-y-6 ">
            <div className="flex flex-col space-y-6 mt-10 md:mt-15">
              <div>
                <p className="text-[#666666] text-xs font-semibold tracking-widest mb-1">CONTACT</p>
                <p className="text-white text-lg font-normal leading-tight">+91 123-456-7890</p>
              </div>
              <div>
                <p className="text-[#666666] text-xs font-semibold tracking-widest mb-1">EMAIL</p>
                <p className="text-white text-base font-normal leading-tight">eclypse@gmail.com</p>
              </div>
            </div>
          </div>
          
          <button 
            aria-label="Scroll to top" 
            className="absolute right-20 top-30   transform -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FontAwesomeIcon icon={faArrowUp} className="text-black text-lg" />
          </button>
          
          
    </footer>
  )
}

export default Footer
