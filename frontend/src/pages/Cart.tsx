import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-normal mb-8">Your Cart</h1>
          <p className="text-xl mb-8">Your cart is empty</p>
          <Link to="/" className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8 md:mb-12">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {/* Desktop headers - hidden on mobile */}
            <div className="hidden sm:grid border-b border-gray-700 pb-4 mb-4 grid-cols-12 text-gray-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Size</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            {cartItems.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="border-b border-gray-800 py-4 sm:py-6 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4 sm:gap-0"
              >
                {/* Product info - stacks vertically on mobile */}
                <div className="sm:col-span-6 flex gap-3 sm:gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded"
                  />
                  <div className="flex flex-col justify-between py-1 sm:py-2">
                    <h3 className="text-base sm:text-lg font-medium">{item.name}</h3>                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm flex items-center gap-2 hover:text-red-400"
                    >
                      <FaTrash size={12} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Mobile product details - visible only on small screens */}
                <div className="sm:hidden flex justify-between items-center w-full">
                  <div>
                    <span className="text-gray-400 text-sm">Size: </span>
                    <span>{item.size}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Price: </span>
                    <span>₹ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>

                {/* Mobile quantity controls - visible only on small screens */}
                <div className="sm:hidden w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Size - hidden on mobile */}
                <div className="hidden sm:block sm:col-span-2 text-center">
                  {item.size}
                </div>

                {/* Quantity - hidden on mobile */}
                <div className="hidden sm:block sm:col-span-2">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {/* Price - hidden on mobile */}
                <div className="hidden sm:block sm:col-span-2 text-right">
                  ₹ {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-black p-4 sm:p-6 rounded-lg mt-4 lg:mt-0 sticky top-20">
            <h2 className="text-xl sm:text-2xl font-normal mb-4 sm:mb-6 border-b border-gray-800 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-800 pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="bg-white text-black px-6 py-3 rounded block text-center font-medium hover:bg-gray-200 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
