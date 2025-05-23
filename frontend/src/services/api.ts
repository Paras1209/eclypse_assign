// API service for interacting with the backend
const API_URL = 'http://localhost:5000/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  stock: number;
}

export interface CartItemToAdd {
  productId: string;
  quantity: number;
  size: string;
}

export interface OrderData {
  products: {
    product: string;
    quantity: number;
    size: string;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  paymentMethod: string;
  totalPrice: number;
  savedPaymentMethodId?: string; // Optional ID of saved payment method for one-click checkout
}

/**
 * Get all products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array on error
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

/**
 * Add item to cart
 * Note: In a real app with authentication, this would update the user's cart in the database
 */
export const addToCart = async (item: CartItemToAdd): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to add item to cart');
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: OrderData): Promise<{ id: string } | null> => {
  try {
    // Get auth token from local storage
    const userJson = localStorage.getItem('eclypseUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = user?.token;

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(orderData),
    });
    
    // Handle error responses with more detail
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Order creation failed:', errorData);
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

/**
 * Order data returned from the API
 */
export interface OrderResponse {
  id: string;
  user?: string;
  products: Array<{
    product: string;
    name?: string;
    quantity: number;
    size: string;
    price?: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

/**
 * Get order by ID
 */
export const getOrderById = async (id: string): Promise<OrderResponse | null> => {
  try {
    // Get auth token from local storage
    const userJson = localStorage.getItem('eclypseUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = user?.token;

    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

/**
 * Payment result from payment processor
 */
export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

/**
 * Update order payment status
 */
export const updateOrderPaymentStatus = async (id: string, paymentResult: PaymentResult): Promise<boolean> => {
  try {
    // Get auth token from local storage
    const userJson = localStorage.getItem('eclypseUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = user?.token;
    
    if (!token) {
      throw new Error('Authorization required');
    }

    const response = await fetch(`${API_URL}/orders/${id}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentResult),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update payment status');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
};
