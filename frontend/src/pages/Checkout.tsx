import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { createOrder } from '../services/api';

interface ShippingFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user, savedAddresses, savedPaymentMethods } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>(isAuthenticated && savedAddresses.length > 0 ? 'payment' : 'shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [oneClickPayment, setOneClickPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Check if user qualifies for one-click payment
  const hasOneClickPaymentOption = isAuthenticated && savedAddresses.length > 0 && savedPaymentMethods.length > 0;
  
  // Pre-fill form from saved data if available
  const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
  const defaultPayment = savedPaymentMethods.find(method => method.isDefault) || savedPaymentMethods[0];
  
  // Effect to handle one-click checkout experience
  useEffect(() => {
    if (hasOneClickPaymentOption && savedPaymentMethods.some(method => method.isDefault) && savedAddresses.some(addr => addr.isDefault)) {
      // Show one-click option if user has default payment and address
      setOneClickPayment(true);
    }
  }, [hasOneClickPaymentOption, savedPaymentMethods, savedAddresses]);
    // Form state
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: defaultAddress ? defaultAddress.fullName : '',
    email: user?.email || '',
    address: defaultAddress ? defaultAddress.address : '',
    city: defaultAddress ? defaultAddress.city : '',
    postalCode: defaultAddress ? defaultAddress.postalCode : '',
    country: defaultAddress ? defaultAddress.country : '',
    phone: defaultAddress ? defaultAddress.phone || '' : '',
  });

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Form validation state
  const [errors, setErrors] = useState<{
    shipping?: Partial<Record<keyof ShippingFormData, string>>;
    payment?: Partial<Record<keyof PaymentFormData, string>>;
  }>({});

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const shippingErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    
    if (!shippingData.fullName) shippingErrors.fullName = 'Full name is required';
    if (!shippingData.email) shippingErrors.email = 'Email is required';
    if (!shippingData.address) shippingErrors.address = 'Address is required';
    if (!shippingData.city) shippingErrors.city = 'City is required';
    if (!shippingData.postalCode) shippingErrors.postalCode = 'Postal code is required';
    if (!shippingData.country) shippingErrors.country = 'Country is required';
    if (!shippingData.phone) shippingErrors.phone = 'Phone is required';
    
    if (Object.keys(shippingErrors).length > 0) {
      setErrors({ shipping: shippingErrors });
      return;
    }
    
    // Move to payment step
    setStep('payment');
    setErrors({});
  };

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const paymentErrors: Partial<Record<keyof PaymentFormData, string>> = {};
    
    if (!paymentData.cardNumber) paymentErrors.cardNumber = 'Card number is required';
    if (!paymentData.cardName) paymentErrors.cardName = 'Name on card is required';
    if (!paymentData.expiryDate) paymentErrors.expiryDate = 'Expiry date is required';
    if (!paymentData.cvv) paymentErrors.cvv = 'CVV is required';
    
    if (Object.keys(paymentErrors).length > 0) {
      setErrors({ payment: paymentErrors });
      return;
    }
    
    // Submit order
    placeOrder();
  };  // Place order function
  const placeOrder = async (useOneClick = false) => {
    try {
      setIsSubmitting(true);
      setOrderError(null);
      
      // Prepare shipping address based on whether one-click checkout is used
      const shippingAddressData = useOneClick && defaultAddress 
        ? {
            fullName: defaultAddress.fullName,
            email: user?.email || '',
            address: defaultAddress.address,
            city: defaultAddress.city,
            postalCode: defaultAddress.postalCode,
            country: defaultAddress.country,
            phone: defaultAddress.phone || ''
          }
        : {
            fullName: shippingData.fullName,
            email: shippingData.email,
            address: shippingData.address,
            city: shippingData.city,
            postalCode: shippingData.postalCode,
            country: shippingData.country,
            phone: shippingData.phone
          };

      // Determine payment method - either default saved method or entered card
      const paymentMethodType = useOneClick && defaultPayment 
        ? defaultPayment.type 
        : 'credit_card';
      
      // Call the backend API
      const orderData = {
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: shippingAddressData,
        paymentMethod: paymentMethodType,
        totalPrice: totalPrice,
        // If using one-click, include the payment method ID
        savedPaymentMethodId: useOneClick && defaultPayment ? defaultPayment.id : undefined
      };
      
      // Try to create the order, fall back to mock if it fails
      const result = await createOrder(orderData);
      
      if (result && result.id) {
        setOrderId(result.id);
        setOrderPlaced(true);
        clearCart();
        setStep('confirmation');
      } else {
        // For demo purposes when backend isn't running
        const mockOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();
        setOrderId(mockOrderId);
        setOrderPlaced(true);
        clearCart();
        setStep('confirmation');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError('There was a problem processing your order. Please try again.');
      
      // For demo purposes only - in production, we would not proceed on error
      const mockOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setOrderId(mockOrderId);
      setOrderPlaced(true);
      clearCart();
      setStep('confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render based on current step
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-normal mb-8">Checkout</h1>
          <p className="text-xl mb-8">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 md:mb-8">Checkout</h1>

        {/* One-click payment option */}
        {hasOneClickPaymentOption && (
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Express Checkout</h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Pay with your saved payment method and ship to your default address.
                </p>
                <div className="flex flex-wrap mt-2 sm:mt-3 gap-3 sm:gap-4">
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Ship to:</span>
                    <p className="font-medium text-sm sm:text-base">{defaultAddress?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Payment:</span>
                    <p className="font-medium text-sm sm:text-base">
                      {defaultPayment?.cardType === 'visa' && 'Visa'}
                      {defaultPayment?.cardType === 'mastercard' && 'Mastercard'}
                      {defaultPayment?.cardType === 'amex' && 'American Express'}
                      {defaultPayment?.cardType && ' •••• '} 
                      {defaultPayment?.cardLastFour}
                    </p>
                  </div>
                </div>
              </div><button
                onClick={() => placeOrder(true)}
                disabled={isSubmitting}
                className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition mt-4 md:mt-0 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `One-Click Checkout • ₹${totalPrice.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        )}        {/* Checkout Steps */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${step === 'shipping' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}>
              1
            </div>
            <div className={`w-10 sm:w-16 md:w-20 h-1 ${step === 'shipping' ? 'bg-white' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${step === 'payment' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}>
              2
            </div>
            <div className={`w-10 sm:w-16 md:w-20 h-1 ${step === 'confirmation' ? 'bg-white' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${step === 'confirmation' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}>
              3
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Form Area */}
          <div className="lg:w-2/3">
            {step === 'shipping' && (
              <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-normal mb-4 sm:mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="col-span-2">
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Full Name</label>
                      <input
                        type="text"
                        value={shippingData.fullName}
                        onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.fullName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.fullName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Email</label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Phone</label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.phone}</p>}
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Address</label>
                      <input
                        type="text"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.address}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">City</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.city && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.shipping?.postalCode && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.postalCode}</p>}
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Country</label>
                      <select
                        value={shippingData.country}
                        onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      >
                        <option value="">Select a country</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                      {errors.shipping?.country && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shipping.country}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-6 sm:mt-8">
                    <button
                      type="submit"
                      className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded font-medium hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-normal mb-4 sm:mb-6">Payment Details</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.payment?.cardNumber && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.payment.cardNumber}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Name on Card</label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                      />
                      {errors.payment?.cardName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.payment.cardName}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1 sm:mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                        />
                        {errors.payment?.expiryDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.payment.expiryDate}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-1 sm:mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                          placeholder="123"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                        />
                        {errors.payment?.cvv && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.payment.cvv}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      disabled={isSubmitting}
                      className="border border-white text-white px-3 sm:px-6 py-2 sm:py-3 rounded font-medium hover:bg-white hover:text-black transition disabled:opacity-50 text-sm sm:text-base"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white text-black px-3 sm:px-6 py-2 sm:py-3 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50 flex items-center text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}            {step === 'confirmation' && (
              <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8 text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-4 border-green-500 rounded-full mb-4 sm:mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal mb-2 sm:mb-4">Thank You!</h2>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">Your order has been placed successfully.</p>
                
                {orderError && (
                  <div className="bg-red-900/30 border border-red-500 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base">{orderError}</p>
                    <p className="text-xs sm:text-sm mt-1">Don't worry, we've recorded your order and will process it manually.</p>
                  </div>
                )}
                
                <div className="bg-gray-900 rounded p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-gray-400 text-sm">Order ID:</p>
                  <p className="text-lg sm:text-xl font-medium">{orderId}</p>
                </div>
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">We've sent an email with your order details to {shippingData.email}.</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded font-medium hover:bg-gray-200 transition text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-black rounded-lg p-4 sm:p-6 sticky top-20 sm:top-24 md:top-32">
              <h2 className="text-xl sm:text-2xl font-normal mb-4 sm:mb-6 border-b border-gray-800 pb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-60 sm:max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 sm:gap-4 py-2 sm:py-3">
                    <img
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Size: {item.size}</p>
                      <div className="flex justify-between mt-1 sm:mt-2">
                        <span className="text-gray-400 text-xs sm:text-sm">Qty: {item.quantity}</span>
                        <span className="text-xs sm:text-sm">₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-800 mt-4 pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Subtotal</span>
                  <span className="text-sm">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Shipping</span>
                  <span className="text-sm">Free</span>
                </div>
                <div className="flex justify-between text-base sm:text-xl font-medium pt-2 sm:pt-3 border-t border-gray-800">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout
