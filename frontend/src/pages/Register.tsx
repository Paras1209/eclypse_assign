import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    // Try to register
    const success = await register(name, email, password);
    
    if (success) {
      navigate('/checkout'); // Redirect to checkout or wherever they came from
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-sm sm:max-w-md mx-auto bg-black rounded-lg p-5 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-normal mb-4 sm:mb-6">Create Account</h1>
        
        {(error || formError) && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black px-4 py-2.5 sm:py-3 rounded font-medium hover:bg-gray-200 transition text-sm sm:text-base"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-gray-400 text-sm sm:text-base">
          <p>Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
