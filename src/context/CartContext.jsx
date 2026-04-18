import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const OPTIONAL_BLESSING_CHARGE = 101;
  // Initialize cart from localStorage immediately to prevent race condition
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
    }
    return [];
  });
  const [includeBlessing, setIncludeBlessingState] = useState(() => {
    try {
      return localStorage.getItem('cart_include_blessing') === 'true';
    } catch (_error) {
      return false;
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
      }
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart_include_blessing', includeBlessing ? 'true' : 'false');
      } catch (_error) {
      }
    }
  }, [includeBlessing, isInitialized]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already exists
        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                discount_percent: product.discount_percent ?? item.discount_percent ?? 0,
                stock: product.stock ?? item.stock,
                sale_type: product.sale_type ?? item.sale_type ?? 'order',
              }
            : item
        );
      } else {
        // Add new product to cart
        return [...prev, {
          id: product.id,
          slug: product.slug || null,
          name: product.name,
          price: product.price,
          images: product.images || [],
          quantity: quantity,
          stock: product.stock,
          sale_type: product.sale_type || 'order',
          category: product.category || '',
          subcategory: product.subcategory,
          deity: product.deity,
          planet: product.planet,
          discount_percent: product.discount_percent ?? 0,
        }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setIncludeBlessingState(false);
  }, []);

  const setIncludeBlessing = useCallback((value) => {
    setIncludeBlessingState(Boolean(value));
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    includeBlessing,
    setIncludeBlessing,
    blessingCharge: includeBlessing ? OPTIONAL_BLESSING_CHARGE : 0,
    OPTIONAL_BLESSING_CHARGE
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

