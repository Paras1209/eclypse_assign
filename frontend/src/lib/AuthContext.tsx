import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SavedPaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  cardLastFour?: string;
  cardType?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  isReturningCustomer: boolean;
  token: string;
  savedPaymentMethods: SavedPaymentMethod[];
  savedAddresses: SavedAddress[];
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isReturningCustomer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  savedPaymentMethods: SavedPaymentMethod[];
  savedAddresses: SavedAddress[];
  saveNewPaymentMethod: (paymentMethod: Omit<SavedPaymentMethod, 'id'>) => Promise<boolean>;
  saveNewAddress: (address: Omit<SavedAddress, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('eclypseUser');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Check if token is still valid by fetching user profile
          const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          });
          
          if (response.ok) {
            // Token is valid, update user state
            const userData = await response.json();
            setUser({
              ...parsedUser,
              ...userData,
            });
          } else {
            // Token is invalid, remove from storage
            localStorage.removeItem('eclypseUser');
            setUser(null);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Auth error:', err);
        setUser(null);
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
      
      // Save user to local storage
      localStorage.setItem('eclypseUser', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return false;
      }
      
      // Save user to local storage
      localStorage.setItem('eclypseUser', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('eclypseUser');
    setUser(null);
  };
  
  const saveNewPaymentMethod = async (paymentMethod: Omit<SavedPaymentMethod, 'id'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/users/payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(paymentMethod),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to save payment method');
        return false;
      }
      
      // Update user state with the new payment method
      if (user) {
        // Make sure we have a valid paymentMethod object from the response
        const newPaymentMethod = data.paymentMethod || {
          ...paymentMethod,
          id: `temp-${Date.now()}`, // Fallback ID if server doesn't provide one
        };
        
        const updatedPaymentMethods = [...user.savedPaymentMethods, newPaymentMethod];
        
        setUser({
          ...user,
          savedPaymentMethods: updatedPaymentMethods,
        });
        
        // Update local storage
        localStorage.setItem('eclypseUser', JSON.stringify({
          ...user,
          savedPaymentMethods: updatedPaymentMethods,
        }));
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to save payment method');
      return false;
    }
  };
  
  const saveNewAddress = async (address: Omit<SavedAddress, 'id'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/users/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(address),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to save address');
        return false;
      }
      
      // Update user state with the new address
      if (user) {
        // Make sure we have a valid address object from the response
        const newAddress = data.address || {
          ...address,
          id: `temp-${Date.now()}`, // Fallback ID if server doesn't provide one
        };
        
        const updatedAddresses = [...user.savedAddresses, newAddress];
        
        setUser({
          ...user,
          savedAddresses: updatedAddresses,
        });
        
        // Update local storage
        localStorage.setItem('eclypseUser', JSON.stringify({
          ...user,
          savedAddresses: updatedAddresses,
        }));
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isReturningCustomer: user?.isReturningCustomer || false,
        login,
        register,
        logout,
        loading,
        error,
        savedPaymentMethods: user?.savedPaymentMethods || [],
        savedAddresses: user?.savedAddresses || [],
        saveNewPaymentMethod,
        saveNewAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};