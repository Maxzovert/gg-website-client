import React, { useState, useEffect } from 'react';
import SprayProductCard from '../../components/SprayProductCard';
import Loader from '../../components/Loader';
import sprayBanner from '../../assets/Spray/4sp.webp';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import Heading from "../../assets/Sprayelem/Header.webp";

const Spray = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/products?category=Sprays');
      
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

  // Generate random review count (for demo purposes)
  const getReviewCount = (productId) => {
    // Use product ID to generate consistent review count
    return 5 + (productId % 3); // Returns 5, 6, or 7
  };

  // Get essence from subcategory
  const getEssence = (subcategory) => {
    if (!subcategory) return null;
    
    // Mapping of subcategories to essences
    const essenceMap = {
      'Chakra Balance': 'Gurhal',
      'Amrat Dhara': 'Lavandur',
      'Maitri': 'Levandur',
      'Shuddhi': 'Kewda/Mogra'
    };
    
    // Check if subcategory matches exactly
    if (essenceMap[subcategory]) {
      return essenceMap[subcategory];
    }
    
    // Try to extract from subcategory if it contains essence info
    // Format: "Subcategory - (Essence - EssenceName)"
    const match = subcategory.match(/\(Essence\s*-\s*([^)]+)\)/i);
    if (match) {
      return match[1].trim();
    }
    
    // Try format: "Subcategory (EssenceName)"
    const match2 = subcategory.match(/\(([^)]+)\)/);
    if (match2) {
      return match2[1].trim();
    }
    
    return null;
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <img src={Heading} alt="" className="w-full mb-6 rounded-4xl" />
        {/* Header with Banner */}
        {/* <div className="mb-6 sm:mb-8 text-center">
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            <img 
              src={sprayBanner} 
              alt="Explore variety of aura sprays" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div> */}
        <div className="relative">
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <SprayProductCard
                  key={product.id}
                  product={product}
                  calculatePricing={pricingFromProduct}
                  getReviewCount={getReviewCount}
                  getEssence={getEssence}
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

export default Spray;

