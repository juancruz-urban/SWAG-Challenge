import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { products as allProducts } from '../data/products'

import './ProductList.css'

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12) // 12 productos por página

  // Usar useMemo para calcular productos filtrados y ordenados eficientemente
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Aplicar filtro de categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      )
    }

    // Aplicar ordenación
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price':
        filtered.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice)
        break
      case 'stock':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      case 'stock-asc':
        filtered.sort((a, b) => a.stock - b.stock)
        break
      default:
        break
    }

    return filtered
  }, [selectedCategory, searchQuery, sortBy, allProducts])

  // Contar categorías únicas
  const categoryCount = useMemo(() => {
    const categories = new Set(allProducts.map(product => product.category))
    return categories.size
  }, [allProducts])

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('name')
    setCurrentPage(1)
  }

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Generar números de página para la paginación
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Al final
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // En medio
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>
          
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">{categoryCount}</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />

        {/* Products Grid */}
        <div className="products-section">
          {currentProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                className="btn btn-primary cta1"
                onClick={resetFilters}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="material-icons">chevron_left</span>
                  </button>
                  
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'ellipsis' : ''}`}
                      onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                      disabled={pageNumber === '...'}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="material-icons">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList