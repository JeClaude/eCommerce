import React, { createContext, useReducer, useContext } from 'react';
import { CartItem } from '../types/indexx';
import cartReducer, { CartAction } from '../reducers/cartReducer';

//type of data we are trying to share 
interface CartContextType {
  cartItems: CartItem[]; // all the items present in the cart at the moment
  dispatch: React.Dispatch<CartAction>; //This will be there so that you can specify what kind of action you are trying to do
}


//creating a context to store the data to be shared 
const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  //useReducer manages the cart state using our cartReducer logic
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Now we can use this custom hook in any compnent
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartProvider;
