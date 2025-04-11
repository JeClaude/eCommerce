// src/components/FilterPanel.tsx
import React, { useState, useEffect } from 'react';

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

  // Send updated filters to parent whenever any filter changes
  useEffect(() => {
    onFilterChange({ selectedCategories, priceRange, minRating });
  }, [selectedCategories, priceRange, minRating]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    setPriceRange((prev) =>
      type === 'min' ? [value, prev[1]] : [prev[0], value]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setMinRating(0);
    onClearFilters(); // optional, if parent wants to reset state
  };

  return (
    <div className="p-4 w-1/4 border rounded">
      <h3 className="font-semibold mb-2">Filter Products</h3>

      {/* Category Filter */}
      <div className="mb-4">
        <h4 className="font-medium">Category</h4>
        {categories.map((category) => (
          <label key={category} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="mr-2"
            />
            {category}
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h4 className="font-medium">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            min={0}
            max={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 'min')}
            className="w-20 border px-2"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            min={priceRange[0]}
            max={10000}
            onChange={(e) => handlePriceChange(e, 'max')}
            className="w-20 border px-2"
          />
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="mb-4">
        <h4 className="font-medium">Minimum Rating</h4>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}+
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterPanel;
