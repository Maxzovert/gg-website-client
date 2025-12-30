import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const Rudraksh = () => {
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
    search: '',
    priceMin: 0,
    priceMax: 100000
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters.subcategory, filters.deity, filters.planet, filters.rarity, filters.search]);

  useEffect(() => {
    // Filter by price on client side
    const filtered = allProducts.filter(product => {
      const price = product.price || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });
    setProducts(filtered);
  }, [filters.priceMin, filters.priceMax, allProducts]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/filters?category=Rudraksha`);
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const result = await response.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: 'Rudraksha',
        ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.deity !== 'all' && { deity: filters.deity }),
        ...(filters.planet !== 'all' && { planet: filters.planet }),
        ...(filters.rarity !== 'all' && { rarity: filters.rarity }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${API_URL}/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      if (result.success) {
        setAllProducts(result.data);
        // Apply price filter on client side
        const filtered = result.data.filter(product => {
          const price = product.price || 0;
          return price >= filters.priceMin && price <= filters.priceMax;
        });
        setProducts(filtered);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
      search: '',
      priceMin: 0,
      priceMax: 100000
    });
  };

  // Calculate max price from products
  const maxPrice = allProducts.length > 0 
    ? Math.max(...allProducts.map(p => p.price || 0), 100000)
    : 100000;

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
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Rudraksha</h1>
          <p className="text-sm sm:text-base text-gray-600">Explore our collection of sacred Rudraksha beads</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-72 xl:w-80 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={filters.priceMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min={filters.priceMin}
                      max={maxPrice}
                      value={filters.priceMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || maxPrice;
                        handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.priceMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                      <input
                        type="range"
                        min={filters.priceMin}
                        max={maxPrice}
                        value={filters.priceMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium pt-2">
                    <span>₹{filters.priceMin.toLocaleString('en-IN')}</span>
                    <span>₹{filters.priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Subcategory Filter */}
              {filterOptions.subcategories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deity
                  </label>
                  <select
                    value={filters.deity}
                    onChange={(e) => handleFilterChange('deity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planet
                  </label>
                  <select
                    value={filters.planet}
                    onChange={(e) => handleFilterChange('planet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rarity
                  </label>
                  <select
                    value={filters.rarity}
                    onChange={(e) => handleFilterChange('rarity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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

              <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FiFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product) => {
                const pricing = calculatePricing(product.price);
                const reviewCount = getReviewCount(product.id);
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm border border-primary overflow-hidden hover:shadow-lg hover:border-primary/80 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative group">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
                        {pricing.discount}% OFF
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 bg-white flex-1 flex flex-col">
                      {/* Badges Section */}
                      {product.subcategory && (
                        <div className="mb-2">
                          <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-md border border-orange-200">
                            {product.subcategory}
                          </span>
                        </div>
                      )}

                      {/* Product Name */}
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1.5 leading-tight">
                        {product.name}
                      </h3>
                      
                      {/* Short Description */}
                      {product.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-snug">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-orange-400 text-xs fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-1">({reviewCount})</span>
                      </div>

                      {/* Pricing Section */}
                      <div className="mt-auto pt-2.5 border-t border-gray-100">
                        <div className="flex items-stretch gap-3">
                          {/* Price and Stock - Left Side */}
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-sm text-gray-400 line-through font-medium">
                                ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                            {product.stock > 0 ? (
                              <span className="inline-flex items-center text-xs font-semibold text-primary">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5"></span>
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-semibold text-red-600">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Cart Button - Right Side */}
                          <button
                            className="border-2 border-primary text-primary bg-transparent w-12 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center shrink-0 self-stretch cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <FaShoppingCart className="text-xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rudraksh;

