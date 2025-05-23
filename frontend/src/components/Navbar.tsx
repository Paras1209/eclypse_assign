import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useCart } from '../lib/CartContext'
import { useAuth } from '../lib/AuthContext'

function Navbar() {
    const { totalItems } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="fixed left-0 top-0 w-full bg-black/59 backdrop-blur-lg py-3 z-50 mb-8 px-4 md:px-8">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo on left */}
                <div className="flex-shrink-0">
                    <Link to="/">
                        <img 
                            src="assets/logo.jpg" 
                            alt="Logo" 
                            className="h-10 sm:h-12 w-auto rounded-md" 
                        />
                    </Link>
                </div>
                
                {/* Mobile menu button */}
                <button 
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                
                {/* Navigation links - desktop */}
                <div className="hidden md:flex flex-grow items-center justify-end space-x-6 lg:space-x-10">
                    <Link to="/about" className="text-white hover:text-gray-300 font-medium text-base lg:text-lg">About Us</Link>
                    <Link to="/waitlist" className="text-white hover:text-gray-300 font-medium text-base lg:text-lg">Waitlist</Link>
                    <Link to="/cart" className="text-white hover:text-gray-300 font-medium text-base lg:text-lg relative">
                        <FaShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    {isAuthenticated ? (
                        <Link to="/account" className="text-white hover:text-gray-300 font-medium text-base lg:text-lg flex items-center gap-2">
                            <FaUser size={16} />
                            <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-300 font-medium text-base lg:text-lg">
                            Sign In
                        </Link>
                    )}
                    
                    <Link to="/checkout" className="bg-white text-black px-4 py-2 lg:px-9 lg:py-3 rounded-md flex items-center justify-center font-medium text-base lg:text-lg">
                        <span>Buy</span>
                    </Link>
                </div>
            </div>

            {/* Mobile menu - slide down */}
            <div className={`md:hidden fixed left-0 right-0 bg-black/95 backdrop-blur-lg transition-all duration-300 z-40 shadow-lg ${isMenuOpen ? 'top-16 opacity-100' : 'top-[-400px] opacity-0'}`}>
                <div className="flex flex-col p-6 space-y-6">
                    <Link to="/about" className="text-white hover:text-gray-300 font-medium text-xl" onClick={toggleMenu}>About Us</Link>
                    <Link to="/waitlist" className="text-white hover:text-gray-300 font-medium text-xl" onClick={toggleMenu}>Waitlist</Link>
                    <Link to="/cart" className="text-white hover:text-gray-300 font-medium text-xl flex items-center gap-2" onClick={toggleMenu}>
                        <FaShoppingCart size={20} />
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    {isAuthenticated ? (
                        <Link to="/account" className="text-white hover:text-gray-300 font-medium text-xl flex items-center gap-2" onClick={toggleMenu}>
                            <FaUser size={16} />
                            <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-300 font-medium text-xl" onClick={toggleMenu}>
                            Sign In
                        </Link>
                    )}
                    
                    <Link to="/checkout" 
                        className="bg-white text-black px-4 py-3 rounded-md flex items-center justify-center font-medium text-xl w-full" 
                        onClick={toggleMenu}
                    >
                        <span>Buy Now</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
