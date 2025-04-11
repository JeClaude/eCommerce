import React from 'react';
import { CartItem as CartItemType } from '../types/indexx';
import CartItem from './CartItem';

interface ShoppingCartProps {
  cartItems: CartItemType[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, onUpdateQuantity, onRemove }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
          <div className="flex justify-between mt-4">
            <span className="font-medium">Total Items: {totalItems}</span>
            <span className="font-bold">Total: ${totalPrice.toFixed(2)}</span>
          </div>
          <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
