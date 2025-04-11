import { CartItem, Product } from '../types/indexx';

// Specifies the actions that can be performed in the cart
export type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number };


// This is the function that says how the cart should change based on the action performed on it
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    // When you are trying to add an item in the cart
    case 'ADD': {
      const exists = state.find(item => item.id === action.product.id);
      // if the item is already there just add one to the quantity
      if (exists) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Or create a new one if it didn't exist
        return [...state, { ...action.product, quantity: 1 }];
      }
    }
    // To remove an item
    case 'REMOVE':
      return state.filter(item => item.id !== action.id);

    // To updae the number of that item accordingly +-
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );

    
    default:
      return state;
  }
};

export default cartReducer;
