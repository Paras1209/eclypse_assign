import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="fixed left-0 top-0 w-full bg-black/59 backdrop-blur-lg py-3 z-50 mb-8  md:px-23">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo on left */}
                <div className="flex-shrink-0">
                    <Link to="/">
                        <img 
                            src="src/assets/logo.jpg" 
                            alt="Logo" 
                            className="h-12 w-auto rounded-md" 
                        />
                    </Link>
                </div>
                
                {/* Navigation links in center */}
                <div className="flex-grow">
                    <div className="hidden md:flex items-center justify-end space-x-15">
                        <Link to="/about" className="text-white hover:text-gray-300 font-medium text-lg">About Us</Link>
                        <Link to="/waitlist" className="text-white hover:text-gray-300 font-medium text-lg">Waitlist</Link>
                        <Link to="/cart" className="text-white hover:text-gray-300 font-medium text-lg">Cart</Link>
                        <Link to="/checkout" className="bg-white text-black px-9 py-3 rounded-md flex items-center justify-center font-medium text-lg">
                            <span>Buy</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
