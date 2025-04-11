import React from 'react'
import { Product } from '../types/indexx';

interface productCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<productCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Product Image */}
          <div className="h-64 w-full bg-gray-100 overflow-hidden">
            <img 
              src={product.image || 'https://via.placeholder.com/320'} 
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              alt={product.name}
            />
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            {/* Category & Rating */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg">{"★".repeat(Math.floor(product.rating))}</span>
                <span className="text-gray-400 text-lg">{"★".repeat(5 - Math.floor(product.rating))}</span>
                <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
              </div>
            </div>
            
            {/* Name & Description */}
            <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            {/* Price & CTA */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <button
                onClick={() => onAddToCart(product)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )
}

export default ProductCard;