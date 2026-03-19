import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Search, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const TechSpecsImport = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.get(`/techspecs/search?query=${encodeURIComponent(searchQuery)}&limit=10`);
      setSearchResults(response.data.results || []);
      if (response.data.results.length === 0) {
        toast.info('No products found. Try a different search term.');
      }
    } catch (error) {
      toast.error('Failed to search TechSpecs database');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (techspecsProduct) => {
    setImporting(true);
    try {
      // Show import dialog to set price and stock
      const price = prompt('Enter price in UGX:', '1000000');
      const stock = prompt('Enter stock quantity:', '10');
      
      if (!price || !stock) {
        toast.error('Import cancelled');
        return;
      }

      const response = await api.post('/admin/products/import-from-techspecs', {
        techspecs_product_id: techspecsProduct.product_id || techspecsProduct.id,
        price: parseFloat(price),
        stock: parseInt(stock),
        condition: 'new',
        featured: false
      });

      toast.success('Product imported successfully!');
      
      // Remove from search results
      setSearchResults(prev => prev.filter(p => 
        (p.product_id || p.id) !== (techspecsProduct.product_id || techspecsProduct.id)
      ));
      
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to import product');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="techspecs-import-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-2">
            Import from TechSpecs
          </h1>
          <p className="text-muted-foreground">
            Search and import products with specifications and images from TechSpecs.io database
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products (e.g., iPhone 15 Pro, Samsung Galaxy S24)"
                className="w-full h-12 px-4 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="search-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 flex items-center"
              data-testid="search-button"
            >
              <Search className="h-5 w-5 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Found {searchResults.length} products
            </h2>
            
            {searchResults.map((product, index) => (
              <div
                key={index}
                className="bg-white border border-border rounded-lg p-6 flex gap-6"
                data-testid={`product-result-${index}`}
              >
                <div className="w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                  {product.front_image || product.images?.[0] ? (
                    <img
                      src={product.front_image || product.images[0]}
                      alt={product.product_name || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">{product.brand}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {product.product_name || product.name}
                  </h3>
                  
                  {product.specifications && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {product.specifications.ram && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">RAM: </span>
                          <span className="font-medium">{product.specifications.ram}</span>
                        </div>
                      )}
                      {product.specifications.storage && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Storage: </span>
                          <span className="font-medium">{product.specifications.storage}</span>
                        </div>
                      )}
                      {product.specifications.screen_size && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Screen: </span>
                          <span className="font-medium">{product.specifications.screen_size}</span>
                        </div>
                      )}
                      {product.specifications.battery && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Battery: </span>
                          <span className="font-medium">{product.specifications.battery}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <button
                    onClick={() => handleImport(product)}
                    disabled={importing}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 flex items-center whitespace-nowrap"
                    data-testid={`import-button-${index}`}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Import
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && !loading && searchQuery && (
          <div className="text-center py-12 bg-accent rounded-lg">
            <p className="text-muted-foreground">No products found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechSpecsImport;
