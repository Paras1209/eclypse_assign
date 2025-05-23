import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Account = () => {
  const { user, isAuthenticated, savedPaymentMethods, savedAddresses, logout, saveNewPaymentMethod, saveNewAddress } = useAuth();
  const navigate = useNavigate();
  
  // State for adding new payment method
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [setAsDefaultPayment, setSetAsDefaultPayment] = useState(false);
  
  // State for adding new address
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [setAsDefaultAddress, setSetAsDefaultAddress] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const handleSubmitPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
      // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate tokenization (in a real app, this would be done with a payment processor)
    const last4 = cardNumber.slice(-4);
    
    // Determine card type (simplistic)
    let cardType = 'unknown';
    if (cardNumber.startsWith('4')) cardType = 'visa';
    else if (cardNumber.startsWith('5')) cardType = 'mastercard';
    else if (cardNumber.startsWith('3')) cardType = 'amex';
      // Save payment method (token is handled internally by backend)
    const success = await saveNewPaymentMethod({
      type: 'credit_card',
      cardLastFour: last4,
      cardType,
      expiry: expiryDate,
      isDefault: setAsDefaultPayment,
    });
    
    if (success) {
      // Reset form
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setSetAsDefaultPayment(false);
      setShowAddPaymentForm(false);
    } else {
      alert('Failed to save payment method. Please try again.');
    }
  };
  
  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName || !address || !city || !postalCode || !country) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Save address
    const success = await saveNewAddress({
      fullName,
      address,
      city,
      postalCode,
      country,
      phone,
      isDefault: setAsDefaultAddress,
    });
    
    if (success) {
      // Reset form
      setFullName('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setCountry('');
      setPhone('');
      setSetAsDefaultAddress(false);
      setShowAddAddressForm(false);
    } else {
      alert('Failed to save address. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal">My Account</h1>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-white/50 rounded hover:bg-white hover:text-black transition text-sm sm:text-base"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-normal mb-4 sm:mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Name</p>
              <p className="text-lg sm:text-xl">{user?.name}</p>
            </div>
            <div className="mt-3 md:mt-0">
              <p className="text-gray-400 text-sm sm:text-base">Email</p>
              <p className="text-lg sm:text-xl break-words">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-normal">Saved Payment Methods</h2>
            <button
              onClick={() => setShowAddPaymentForm(!showAddPaymentForm)}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-white text-black rounded hover:bg-gray-200 transition text-sm sm:text-base"
            >
              {showAddPaymentForm ? 'Cancel' : 'Add New'}
            </button>
          </div>
          
          {savedPaymentMethods.length === 0 && !showAddPaymentForm && (
            <p className="text-gray-400">You don't have any saved payment methods.</p>
          )}
          
          {/* List of saved payment methods */}          {savedPaymentMethods.length > 0 && (
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {savedPaymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-800 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      {method.cardType === 'visa' && <span className="text-blue-400">Visa</span>}
                      {method.cardType === 'mastercard' && <span className="text-orange-400">Mastercard</span>}
                      {method.cardType === 'amex' && <span className="text-green-400">Amex</span>}
                      <span>•••• {method.cardLastFour}</span>
                      {method.isDefault && <span className="bg-green-800 text-green-200 px-2 py-0.5 rounded text-xs">Default</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Expires: {method.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add new payment method form */}
          {showAddPaymentForm && (
            <form onSubmit={handleSubmitPaymentMethod} className="border border-gray-800 rounded-lg p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">Add Payment Method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Name on Card</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setAsDefaultPayment}
                    onChange={(e) => setSetAsDefaultPayment(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Set as default payment method</span>
                </label>
              </div>
              
              <button
                type="submit"
                className="bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded text-sm sm:text-base font-medium hover:bg-gray-200 transition"
              >
                Save Payment Method
              </button>
            </form>
          )}
        </div>
          {/* Addresses */}
        <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-normal">Saved Addresses</h2>
            <button
              onClick={() => setShowAddAddressForm(!showAddAddressForm)}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-white text-black rounded hover:bg-gray-200 transition text-sm sm:text-base"
            >
              {showAddAddressForm ? 'Cancel' : 'Add New'}
            </button>
          </div>
          
          {savedAddresses.length === 0 && !showAddAddressForm && (
            <p className="text-gray-400 text-sm sm:text-base">You don't have any saved addresses.</p>
          )}
          
          {/* List of saved addresses */}
          {savedAddresses.length > 0 && (
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="border border-gray-800 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h4 className="font-medium text-base sm:text-lg">{addr.fullName}</h4>
                    {addr.isDefault && <span className="bg-green-800 text-green-200 px-2 py-0.5 rounded text-xs mt-1 sm:mt-0 inline-block">Default</span>}
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base mt-2">{addr.address}</p>
                  <p className="text-gray-400 text-sm sm:text-base">{addr.city}, {addr.postalCode}</p>
                  <p className="text-gray-400 text-sm sm:text-base">{addr.country}</p>
                  {addr.phone && <p className="text-gray-400 text-sm sm:text-base">{addr.phone}</p>}
                </div>
              ))}
            </div>
          )}
          
          {/* Add new address form */}
          {showAddAddressForm && (
            <form onSubmit={handleSubmitAddress} className="border border-gray-800 rounded-lg p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">Add Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">Phone (optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setAsDefaultAddress}
                    onChange={(e) => setSetAsDefaultAddress(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Set as default address</span>
                </label>
              </div>
              
              <button
                type="submit"
                className="bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded text-sm sm:text-base font-medium hover:bg-gray-200 transition"
              >
                Save Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
