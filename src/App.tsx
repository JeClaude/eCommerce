import React, { useState, useContext, createContext } from 'react';
import CartItem from './components/CartItem';
import ProductGrid from './components/ProductGrid';
import { CartItem as CartItemType, Product } from './types/indexx';
import FilterPanel from './components/FilterPanel';

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

  const addToCart = (product: Product) => {
    const newItem: CartItemType = { ...product, quantity: 1 };
    setCart((prevCart) => [...prevCart, newItem]);
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
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Sample product data
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
    <div className="p-4 ">
      {/* Search and Filter Button Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Products"
          className="p-2 border rounded w-full md:w-96"
          onChange={(e) => searchProducts(e.target.value)}
        />
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
        >
          {showFilterPanel ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
  
      {/* Main Content Area - Horizontal Layout */}
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
  
        {/* Product Grid (Right Side) */}
        <div className={`${showFilterPanel ? 'w-full md:w-3/4' : 'w-full'}`}>
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
        </div>
      </div>
  
      {/* Cart Section */}
      <div className="mt-8">
        <h2 className="font-semibold text-xl">Your Cart</h2>
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
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