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
  price: 20.99,
  image: 'https://api.etonshirts.com/v1/retail/image/1620/bynder/6d2812a0-e986-47a5-a087-49dcedcff428/navy-filo-di-scozia-t-shirt-t-shirt_2024-01-10T141049633Z.webp',
  category: 'Clothing',
  rating: 4.5,
  description: 'A comfortable cotton t-shirt',
},
{
  id: 2,
  name: 'Laser mouse 23XX',
  price: 1999,
  image: 'https://brain-images-ssl.cdn.dixons.com/3/2/10239523/l_10239523_004.jpg',
  category: 'Electronics',
  rating: 3,
  description: 'High quality mouse',
},
{
  id: 3,
  name: 'Nebula Hoodie',
  price: 49.99,
  image: 'https://rastah.co/cdn/shop/files/Blue-Hoodie-Back-Photoroom.png?v=1731138142',
  category: 'Clothing',
  rating: 4.6,
  description: 'A galaxy-themed hoodie that feels like a cloud. Great for stargazers.',
},
{
  id: 4,
  name: 'Quantum Earbuds',
  price: 1599,
  image: '',
  category: 'Electronics',
  rating: 4.9,
  description: 'Earbuds with AI-powered ambient sound adjustment. Basically future tech.',
},
{
  id: 5,
  name: 'Retro GamePad X',
  price: 899,
  image: '',
  category: 'Electronics',
  rating: 4.5,
  description: 'Old school look, new school power. Bluetooth gamepad for all devices.',
},
{
  id: 6,
  name: 'Minimalist Watch – Black Sand',
  price: 129.99,
  image: '',
  category: 'Accessories',
  rating: 4.2,
  description: 'Timeless design meets modern movement. Pure style, no distractions.',
},
{
  id: 7,
  name: 'The Writer\'s Journal',
  price: 22.5,
  image: '',
  category: 'Stationery',
  rating: 4.7,
  description: 'Handcrafted vegan leather journal for writers, poets, and dreamers.',
},
{
  id: 8,
  name: 'Coffee Mug – Code & Caffeine',
  price: 14.0,
  image: '',
  category: 'Lifestyle',
  rating: 4.8,
  description: 'Ceramic mug for those late-night code sprints. Debug responsibly.',
},
{
  id: 9,
  name: 'Firefly LED Strip (RGB)',
  price: 499,
  image: '',
  category: 'Electronics',
  rating: 4.4,
  description: 'Set the mood. 16 million colors. Music sync. Remote controlled.',
},
{
  id: 10,
  name: 'Sneakers – SkyStep Edition',
  price: 74.95,
  image: '',
  category: 'Clothing',
  rating: 4.1,
  description: 'Ultra-light sneakers made for walking on clouds... or pavement.',
},
{
  id: 11,
  name: 'Digital Bonsai Tree',
  price: 159.0,
  image: '',
  category: 'Home Decor',
  rating: 4.3,
  description: 'A low-maintenance bonsai that glows gently based on your mood. Seriously.',
},
{
  id: 12,
  name: 'Tactical Laptop Backpack',
  price: 89.99,
  image: '',
  category: 'Accessories',
  rating: 4.6,
  description: 'Weatherproof. Theft-proof. Looks like you mean business.',
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









