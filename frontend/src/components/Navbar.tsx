import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="bg-black shadow px-10 py-3 ">
            <div className="container mx-auto flex items-center justify-between ">
                {/* Logo on left */}
                <div className="flex-shrink-0">
                    <Link to="/">
                        <img 
                            src="src/assets/logo.jpg" 
                            alt="Logo" 
                            className="h-10 w-auto" 
                        />
                    </Link>
                </div>
                
                {/* Navigation links in center */}
                <div className="flex-grow">
                    <div className="hidden md:flex items-center justify-end space-x-12">
                        <Link to="/" className="text-white hover:text-gray-300 font-medium text-lg">About Us</Link>
                        <Link to="/products" className="text-white hover:text-gray-300 font-medium text-lg">Waitlist</Link>
                        <Link to="/about" className="text-white hover:text-gray-300 font-medium text-lg">Cart</Link>
                        <Link to="/cart" className="bg-white text-black px-5 py-2 rounded-md flex items-center justify-center font-medium text-lg">
                            <span>Buy</span>
                        </Link>
                    </div>
                </div>
                
                
            </div>
        </nav>
    )
}

export default Navbar