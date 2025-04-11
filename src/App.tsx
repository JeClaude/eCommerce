import React, { useState, useContext, createContext } from 'react';
import CartItem from './components/CartItem';
import ProductGrid from './components/ProductGrid';
import { CartItem as CartItemType, Product } from './types/indexx';
import FilterPanel from './components/FilterPanel';
import ShoppingCart from './components/ShoppingCart';

const CartContext = createContext<{
  cart: CartItemType[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  // Load cart from localStorage on first render
  React.useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Sample product data (unchanged from your original code)
const sampleProducts: Product[] = [
  

{
  id: 1,
  name: 'T-shirt',
  price: 520.99,
  image: 'play.jpg',
  category: 'Clothing',
  rating: 4.5,
  description: 'Plyaboi Carti',
},
{
  id: 1,
  name: 'Dodge',
  price: 700020.99,
  image: 'Dodge.jpg',
  category: 'Electronics',
  rating: 5,
  description: 'Dodge challenger',
},
{
  id: 1,
  name: 'JBL',
  price: 99.99,
  image: 'JBL.jpg',
  category: 'Electronics',
  rating: 3.5,
  description: 'JBL Headphones',
},
{
  id: 1,
  name: 'T-shirt',
  price: 520.99,
  image: 'play.jpg',
  category: 'Clothing',
  rating: 4.5,
  description: 'Plyaboi Carti',
},
{
  id: 1,
  name: 'Legion Gaming',
  price: 1520.99,
  image: 'legion.jpg',
  category: 'Electronics',
  rating: 5,
  description: 'Lenovo Gaming Laptop',
},
{
  id: 1,
  name: 'Cortez',
  price: 200.99,
  image: 'Cortez.jpg',
  category: 'Shoes',
  rating: 4.5,
  description: 'Collab of Nike and Cortez',
},

];

// Filter type
interface FilterState {
  selectedCategories: string[];
  priceRange: [number, number];
  minRating: number;
}

const App: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } =
    useContext(CartContext);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);

  const applyFilters = (filters: FilterState) => {
    const { selectedCategories, priceRange, minRating } = filters;
    const filtered = sampleProducts.filter((product) => {
      const inCategory =
        selectedCategories.length === 0 ||
        (product.category && selectedCategories.includes(product.category));
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const meetsRating = product.rating >= minRating;
      return inCategory && inPriceRange && meetsRating;
    });
    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilteredProducts(sampleProducts);
  };

  const searchProducts = (query: string) => {
    const filtered = sampleProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-4 relative">
      {/* Header with title, search and buttons */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">ShopHub</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Products"
            className="p-2 border rounded w-full md:w-96"
            onChange={(e) => searchProducts(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
            >
              {showFilterPanel ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={() => setShowCartPanel(!showCartPanel)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 whitespace-nowrap"
            >
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filter Panel (Left Side) */}
        {showFilterPanel && (
          <div className="w-full md:w-1/4">
            <FilterPanel
              categories={
                [...new Set(sampleProducts.map((p) => p.category).filter(Boolean))] as string[]
              }
              onFilterChange={applyFilters}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Product Grid (Center) */}
        <div className={`${showFilterPanel ? 'w-full md:w-3/4' : 'w-full'}`}>
          <h2 className="text-xl font-semibold mb-4">Shop Our Products</h2>
          <p className="text-gray-600 mb-4">Showing {filteredProducts.length} products</p>
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
        </div>

        {/* Shopping Cart Side Panel */}
        {showCartPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCartPanel(false)}></div>
        )}
        <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 
                        ${showCartPanel ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart ({cart.length} items)</h2>
              <button 
                onClick={() => setShowCartPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ShoppingCart 
              cartItems={cart} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Root: React.FC = () => (
  <div className="min-h-screen bg-[#f9f9f9] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
    <div className="container mx-auto p-4">
      <CartProvider>
        <App />
      </CartProvider>
    </div>
  </div>
);

export default Root;









