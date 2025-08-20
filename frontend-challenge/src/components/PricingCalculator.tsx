import { useState, useEffect } from 'react'
import { Product } from '../types/Product'
import { useCart } from '../contexts/CartContext'
import './PricingCalculator.css'

interface PricingCalculatorProps {
  product: Product
}

const PricingCalculator = ({ product }: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedBreak, setSelectedBreak] = useState<number>(-1)
  const { addToCart, isInCart } = useCart()

  // Validar y normalizar la cantidad
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 1
    const validatedQty = Math.max(1, Math.min(product.stock, numValue))
    setQuantity(validatedQty)
    setSelectedBreak(-1)
  }

  // Find applicable price break for a given quantity
  const findApplicableBreak = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return null
    }

    const sortedBreaks = [...product.priceBreaks].sort((a, b) => b.minQty - a.minQty)
    return sortedBreaks.find(breakItem => qty >= breakItem.minQty) || sortedBreaks[sortedBreaks.length - 1]
  }

  // Calculate price for quantity
  const calculatePrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice * qty
    }

    const applicableBreak = findApplicableBreak(qty)
    return applicableBreak ? applicableBreak.price * qty : product.basePrice * qty
  }

  // Calculate discount percentage
  const getDiscountPercent = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return 0
    }

    const baseTotal = product.basePrice * qty
    const discountedTotal = calculatePrice(qty)
    
    if (baseTotal <= 0) return 0
    
    return ((baseTotal - discountedTotal) / baseTotal) * 100
  }

  // Get unit price for quantity
  const getUnitPrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice
    }

    const applicableBreak = findApplicableBreak(qty)
    return applicableBreak ? applicableBreak.price : product.basePrice
  }

  // Format price in CLP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id, // Esto ahora es number, no string
      price: unitPrice,
      name: product.name,
      sku: product.sku,
      image: product.image?.[0],
      category: product.category
    });

    // Feedback visual
    const button = document.querySelector('.btn-add-to-cart');
    if (button) {
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.classList.remove('added-to-cart');
      }, 2000);
    }
  };

  const currentPrice = calculatePrice(quantity)
  const unitPrice = getUnitPrice(quantity)
  const discountPercent = getDiscountPercent(quantity)
  const productInCart = isInCart(product.id)

  // Efecto para seleccionar automáticamente el break correspondiente
  useEffect(() => {
    if (product.priceBreaks && product.priceBreaks.length > 0) {
      const applicableBreak = findApplicableBreak(quantity)
      if (applicableBreak) {
        const breakIndex = product.priceBreaks.findIndex(
          breakItem => breakItem.minQty === applicableBreak.minQty
        )
        setSelectedBreak(breakIndex)
      }
    }
  }, [quantity, product.priceBreaks])

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Quantity Input */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="quantity-input p1"
              min="1"
              max={product.stock}
            />
            <span className="quantity-unit l1">unidades (máx: {product.stock})</span>
          </div>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks
                .sort((a, b) => a.minQty - b.minQty)
                .map((priceBreak, index) => {
                  const isActive = quantity >= priceBreak.minQty
                  const isSelected = selectedBreak === index
                  
                  return (
                    <div 
                      key={index}
                      className={`price-break ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedBreak(index)
                        setQuantity(priceBreak.minQty)
                      }}
                    >
                      <div className="break-quantity l1">
                        {priceBreak.minQty}+ unidades
                      </div>
                      <div className="break-price p1-medium">
                        {formatPrice(priceBreak.price)} c/u
                      </div>
                      {priceBreak.discount && (
                        <div className="break-discount l1">
                          -{priceBreak.discount}%
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatPrice(unitPrice)}
            </span>
          </div>
          
          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="calculator-actions">
          <button 
            className="btn btn-secondary cta1"
            onClick={() => {
              alert(`Cotización solicitada para ${quantity} unidades de ${product.name}`)
            }}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>
          
          <button 
            className={`btn btn-primary cta1 btn-add-to-cart ${productInCart ? 'in-cart' : ''}`}
            disabled={quantity > product.stock}
            onClick={handleAddToCart}
          >
            <span className="material-icons">
              {productInCart ? 'check' : 'shopping_cart'}
            </span>
            {productInCart ? 'En el carrito' : 'Agregar al carrito'}
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="material-icons">local_shipping</span>
            <div className="info-content">
              <span className="info-title l1">Envío gratis</span>
              <span className="info-detail l1">En pedidos sobre $50.000</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="material-icons">schedule</span>
            <div className="info-content">
              <span className="info-title l1">Tiempo de producción</span>
              <span className="info-detail l1">7-10 días hábiles</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="material-icons">verified</span>
            <div className="info-content">
              <span className="info-title l1">Garantía</span>
              <span className="info-detail l1">30 días de garantía</span>
            </div>
          </div>

          {productInCart && (
            <div className="info-item">
              <span className="material-icons" style={{color: '#10b981'}}>check_circle</span>
              <div className="info-content">
                <span className="info-title l1">En tu carrito</span>
                <span className="info-detail l1">Este producto ya fue agregado</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PricingCalculator