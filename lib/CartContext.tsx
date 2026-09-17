'use client';

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  /** Products sold on request (hide_price) can never be in the cart. */
  hidePrice?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  /** True when price-on-request items were removed from a saved cart. */
  removedPriceOnRequest: boolean;
  dismissRemovedNotice: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [removedPriceOnRequest, setRemovedPriceOnRequest] = useState(false);

  useEffect(() => {
    let saved: CartItem[] = [];
    try {
      saved = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(saved)) saved = [];
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
    }

    const allowed = saved.filter((item) => !item.hidePrice);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(allowed);
    if (allowed.length !== saved.length) setRemovedPriceOnRequest(true);
    setIsLoaded(true);

    // A product may have switched to "price on request" since it was saved: check with the catalog.
    if (allowed.length === 0) return;
    const ids = Array.from(new Set(allowed.map((item) => item.id)));
    fetch(`/api/products?ids=${encodeURIComponent(ids.join(','))}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((products: { id: string; hide_price: boolean }[] | null) => {
        if (!Array.isArray(products)) return;
        const hidden = new Set(products.filter((p) => p.hide_price).map((p) => p.id));
        if (hidden.size === 0) return;
        setItems((prev) => prev.filter((item) => !hidden.has(item.id)));
        setRemovedPriceOnRequest(true);
      })
      .catch((e) => console.error('Failed to validate cart', e));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    if (newItem.hidePrice) return false;
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevItems, newItem];
    });
    return true;
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const dismissRemovedNotice = useCallback(() => setRemovedPriceOnRequest(false), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        removedPriceOnRequest,
        dismissRemovedNotice,
      }}
    >
      {children}
      {removedPriceOnRequest && <RemovedItemsNotice onClose={dismissRemovedNotice} />}
    </CartContext.Provider>
  );
}

function RemovedItemsNotice({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:end-6 sm:max-w-sm z-[70] flex items-start gap-3 rounded-2xl bg-slate-900 text-white p-4 shadow-2xl"
    >
      <span className="material-symbols-outlined text-primary shrink-0">info</span>
      <p className="text-sm font-medium leading-relaxed flex-1">{t.cart.removedPriceOnRequest}</p>
      <button onClick={onClose} aria-label={t.listing.close} className="text-slate-400 hover:text-white cursor-pointer shrink-0">
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
