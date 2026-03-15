import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    condition: 'new',
    stock: '',
    description: '',
    featured: false,
    images: [],
    specifications: {
      ram: '',
      storage: '',
      processor: '',
      screen_size: '',
      battery: '',
      camera: '',
      os: ''
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products').then(response => {
      setProducts(response.data);
    }).finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.product_id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', data);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      condition: product.condition,
      stock: product.stock.toString(),
      description: product.description,
      featured: product.featured,
      images: product.images || [],
      specifications: product.specifications || {
        ram: '',
        storage: '',
        processor: '',
        screen_size: '',
        battery: '',
        camera: '',
        os: ''
      }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      condition: 'new',
      stock: '',
      description: '',
      featured: false,
      images: [],
      specifications: {
        ram: '',
        storage: '',
        processor: '',
        screen_size: '',
        battery: '',
        camera: '',
        os: ''
      }
    });
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/products/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to import products');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="admin-products-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground" data-testid="admin-products-title">Manage Products</h1>
          <div className="flex gap-2">
            <label className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/80 font-medium transition-colors cursor-pointer flex items-center" data-testid="bulk-import-button">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
              <input type="file" accept=".csv" onChange={handleBulkImport} className="hidden" />
            </label>
            <button
              onClick={() => {
                setEditingProduct(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 font-medium transition-colors flex items-center"
              data-testid="add-product-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(product => (
                <tr key={product.product_id} data-testid={`product-row-${product.product_id}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.brand}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.stock}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary hover:text-primary/80"
                        data-testid={`edit-${product.product_id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`delete-${product.product_id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="product-modal">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-category"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (UGX)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-stock"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Condition</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-product-condition"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="input-product-description"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4"
                      data-testid="input-product-featured"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                    data-testid="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    data-testid="save-button"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;