import React, { useState, useEffect, useCallback } from 'react';

export interface FilterState {
  selectedCategories: string[];
  priceRange: [number, number];
  minRating: number;
}

interface FilterPanelProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  onFilterChange,
  onClearFilters,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    onFilterChange({ selectedCategories, priceRange, minRating });
  }, [selectedCategories, priceRange, minRating, onFilterChange]);

  // handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  // handle minimum price change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange(([, max]) => [Math.min(value, max), max]);
  };

  // handle maximum price change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange(([min]) => [min, Math.max(value, min)]);
  };

  // handle clear filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setMinRating(0);
    onClearFilters();
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Filter Products</h3>
  
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Category</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">
            Price Range (${priceRange[0]} - ${priceRange[1]})
          </h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 w-12">Min:</span>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-700 w-16">${priceRange[0]}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 w-12">Max:</span>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-700 w-16">${priceRange[1]}</span>
            </div>
          </div>
        </div>
  
        {/* Minimum Rating Filter */}
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Minimum Rating</h4>
          <div className="flex items-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`px-3 py-1 rounded-full text-sm ${
                  minRating === rating
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating}+
              </button>
            ))}
          </div>
        </div>
  
        {/* Clear Filters Button */}
        <button
          className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          onClick={handleClearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
