import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = (game, pass) => {
    setItems(prev => {
      const exists = prev.find(i => i.passId === pass.id && i.gameId === game.id);
      if (exists) return prev;
      return [...prev, {
        gameId: game.id, gameName: game.name,
        passId: pass.id, name: pass.name,
        price: pass.price, emoji: pass.emoji,
        imageUrl: pass.imageUrl || null,
      }];
    });
    // НЕ открываем корзину автоматически
  };

  const removeItem = (gameId, passId) => {
    setItems(prev => prev.filter(i => !(i.gameId === gameId && i.passId === passId)));
  };

  const hasItem = (gameId, passId) => items.some(i => i.gameId === gameId && i.passId === passId);
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, hasItem, total, count, cartOpen, setCartOpen, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
