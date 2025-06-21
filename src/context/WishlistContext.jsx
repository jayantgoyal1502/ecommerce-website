import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user && user.token) {
      fetch("http://localhost:5050/api/wishlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setWishlist(data));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user || !user.token) return;
    const res = await fetch("http://localhost:5050/api/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: product._id || product.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setWishlist(data);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !user.token) return;
    const res = await fetch("http://localhost:5050/api/wishlist/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      const data = await res.json();
      setWishlist(data);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => (p._id || p.id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
