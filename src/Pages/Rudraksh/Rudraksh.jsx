import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import rudrakshBanner from '../../assets/RudraksPageImg/rd1.png';

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
        {/* Header with Banner */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">Explore Variety of Rudraksha</h1>
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            <img 
              src={rudrakshBanner} 
              alt="Explore variety of Rudraksha" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Filter Toggle for Mobile */}
        <div className="mb-4 sm:mb-6 lg:hidden flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            aria-label="Toggle filters"
          >
            <FiFilter className="text-xl" />
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-out ${
            showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowFilters(false)}
        ></div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 relative">
          {/* Sidebar Filters */}
          <aside className={`
            fixed lg:static
            top-0 left-0
            h-full lg:h-auto
            w-72 sm:w-80 lg:w-72 xl:w-80
            bg-white
            z-50 lg:z-auto
            transform transition-all duration-300 ease-out
            ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}
            ${showFilters ? 'visible' : 'invisible lg:visible'}
            shadow-2xl lg:shadow-md
            overflow-y-auto lg:overflow-visible
          `}>
            <div className="p-4 sm:p-6 lg:rounded-lg lg:sticky lg:top-4 h-full lg:h-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
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

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 xl:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="rudraksh"
                  calculatePricing={calculatePricing}
                  getReviewCount={getReviewCount}
                />
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rudraksh;

