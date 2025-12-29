import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const Spray = () => {
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    subcategories: [],
    deities: [],
    planets: [],
    rarities: []
  });
  const [filters, setFilters] = useState({
    subcategory: 'all',
    deity: 'all',
    planet: 'all',
    rarity: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const url = `${API_URL}/api/products/filters?category=Sprays`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch filter options: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: 'Sprays',
        ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.deity !== 'all' && { deity: filters.deity }),
        ...(filters.planet !== 'all' && { planet: filters.planet }),
        ...(filters.rarity !== 'all' && { rarity: filters.rarity }),
        ...(filters.search && { search: filters.search })
      });

      const url = `${API_URL}/api/products?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      subcategory: 'all',
      deity: 'all',
      planet: 'all',
      rarity: 'all',
      search: ''
    });
  };

  // Calculate original price and discount
  const calculatePricing = (price) => {
    // Default discount percentage (can be customized per product)
    const discountPercent = 25; // Default 25% discount
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice: originalPrice,
      discount: discountPercent
    };
  };

  // Generate random review count (for demo purposes)
  const getReviewCount = (productId) => {
    // Use product ID to generate consistent review count
    return 5 + (productId % 3); // Returns 5, 6, or 7
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sprays</h1>
          <p className="text-gray-600">Explore our collection of spiritual sprays</p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subcategory Filter */}
              {filterOptions.subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Subcategories</option>
                    {filterOptions.subcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Deity Filter */}
              {filterOptions.deities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deity
                  </label>
                  <select
                    value={filters.deity}
                    onChange={(e) => handleFilterChange('deity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Deities</option>
                    {filterOptions.deities.map((deity) => (
                      <option key={deity} value={deity}>
                        {deity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Planet Filter */}
              {filterOptions.planets.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planet
                  </label>
                  <select
                    value={filters.planet}
                    onChange={(e) => handleFilterChange('planet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Planets</option>
                    {filterOptions.planets.map((planet) => (
                      <option key={planet} value={planet}>
                        {planet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rarity Filter */}
              {filterOptions.rarities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rarity
                  </label>
                  <select
                    value={filters.rarity}
                    onChange={(e) => handleFilterChange('rarity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Rarities</option>
                    {filterOptions.rarities.map((rarity) => (
                      <option key={rarity} value={rarity}>
                        {rarity}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const pricing = calculatePricing(product.price);
                const reviewCount = getReviewCount(product.id);
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          No Image
                        </div>
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded">
                        {pricing.discount}% OFF
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 bg-white">
                      {/* Product Name */}
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      
                      {/* Short Description */}
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-orange-500 text-sm" />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">({reviewCount})</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-800">
                          ₹ {pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹ {pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Stock Status */}
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Spray;

