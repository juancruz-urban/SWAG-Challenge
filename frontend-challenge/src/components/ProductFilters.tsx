import { useState, useEffect } from 'react'
import { categories, suppliers, products } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange
}: ProductFiltersProps) => {
  const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({})
  const [supplierCounts, setSupplierCounts] = useState<{[key: string]: number}>({})

  // Calcular conteos reales de productos por categoría
  useEffect(() => {
    const counts: {[key: string]: number} = {}
    categories.forEach(category => {
      counts[category.id] = products.filter(p => p.category === category.id).length
    })
    setCategoryCounts(counts)
  }, [])

  // Calcular conteos reales de productos por proveedor
  useEffect(() => {
    const counts: {[key: string]: number} = {}
    suppliers.forEach(supplier => {
      counts[supplier.id] = products.filter(p => p.supplier === supplier.id).length
    })
    setSupplierCounts(counts)
  }, [])

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {/* Botón para "Todas las categorías" */}
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onCategoryChange('all')}
            >
              <span className="material-icons">category</span>
              <span className="category-name l1">Todas las categorías</span>
              <span className="category-count l1">({products.length})</span>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({categoryCounts[category.id] || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="price">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="stock">Stock: Mayor a Menor</option>
            <option value="stock-asc">Stock: Menor a Mayor</option>
          </select>
        </div>

        {/* Supplier List with real counts */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="supplier-item">
                <span className="supplier-name l1">{supplier.name}</span>
                <span className="supplier-count l1">{supplierCounts[supplier.id] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters