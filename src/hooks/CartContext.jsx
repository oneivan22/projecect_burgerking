import { createContext, useState, useEffect } from 'react';
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('bk-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [promoCode, setPromoCode] = useState(() => localStorage.getItem('bk-promo') || '');

  useEffect(() => {
    localStorage.setItem('bk-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (promoCode) localStorage.setItem('bk-promo', promoCode);
    else localStorage.removeItem('bk-promo');
  }, [promoCode]);

  function addToCart(product, quantity = 1) {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }

  function removeFromCart(productId) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) return removeFromCart(productId);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = parseFloat(
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );
  const discount = promoCode === 'promo10' ? 0.1 : 0;
  const discountedPrice = parseFloat((totalPrice * (1 - discount)).toFixed(2));

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      discountedPrice,
      discount,
      promoCode,
      setPromoCode,
    }}>
      {children}
    </CartContext.Provider>
  );
}

