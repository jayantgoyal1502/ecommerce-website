import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user && user.token) {
      fetch("http://localhost:5050/api/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!user || !user.token) return;
    const res = await fetch("http://localhost:5050/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: product._id || product.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setCartItems(data);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !user.token) return;
    const res = await fetch("http://localhost:5050/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      const data = await res.json();
      setCartItems(data);
    }
  };

  const increaseQty = async (id) => {
    if (!user || !user.token) return;
    const item = cartItems.find((i) => (i.product._id || i.product.id) === id);
    if (!item) return;
    const res = await fetch("http://localhost:5050/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: id, quantity: item.quantity + 1 }),
    });
    if (res.ok) {
      const data = await res.json();
      setCartItems(data);
    }
  };

  const decreaseQty = async (id) => {
    if (!user || !user.token) return;
    const item = cartItems.find((i) => (i.product._id || i.product.id) === id);
    if (!item || item.quantity <= 1) return;
    const res = await fetch("http://localhost:5050/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: id, quantity: item.quantity - 1 }),
    });
    if (res.ok) {
      const data = await res.json();
      setCartItems(data);
    }
  };

  const clearCart = async () => {
    if (!user || !user.token) return;
    const res = await fetch("http://localhost:5050/api/cart/clear", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (res.ok) setCartItems([]);
  };

  const [shippingInfo, setShippingInfo] = useState(null);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, shippingInfo, setShippingInfo }}>
      {children}
    </CartContext.Provider>
  );
}
