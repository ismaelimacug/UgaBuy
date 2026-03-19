import React, {createContext, useState, useEffect, useContext} from 'react';
import api from '../services/api';
import {useAuth} from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
  const [cart, setCart] = useState({items: []});
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({items: []});
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', {product_id: productId, quantity});
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      await api.put('/cart/update', {product_id: productId, quantity});
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async productId => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        removeFromCart,
        getCartCount,
        loading,
        fetchCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;