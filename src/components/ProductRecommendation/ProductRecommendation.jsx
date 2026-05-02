import { useContext } from 'react';
import { CartContext } from '../../hooks/CartContext';
import styles from './ProductRecommendation.module.css';

function ProductRecommendation({ product, onClose }) {
  const { cartItems, addToCart, updateQuantity } = useContext(CartContext);
  const recommendedProducts = [
    { id: 1, name: 'Кинг Фри', price: 114.99, image: './images/king-fries.png' },
    { id: 10, name: 'Эвервесс Кола', price: 184.99, image: './images/evervess-cola.png' },
    { id: 12, name: 'Соус Барбекю', price: 69.99, image: './images/sauce-bbq.png' },
  ];

  function handleToggleCart(recProduct) {
    const existingItem = cartItems.find(item => item.id === recProduct.id);
    if (existingItem) updateQuantity(recProduct.id, existingItem.quantity - 1);
    else addToCart(recProduct);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2 className={styles.title}>Добавить к заказу?</h2>
        <p className={styles.subtitle}>Мы рекомендуем эти товары к вашему {product.name}</p>

        <div className={styles.recommendations}>
          {recommendedProducts.map(recProduct => {
            const inCart = cartItems.find(item => item.id === recProduct.id);
            return (
              <div key={recProduct.id} className={styles.recommendationItem}>
                <div className={styles.productImage}>
                  {recProduct.image ? (
                    <img src={recProduct.image} alt={recProduct.name} className={styles.productImg} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>Фото</span>
                    </div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{recProduct.name}</h3>
                  <p className={styles.productPrice}>{recProduct.price} ₽</p>
                  <div className={styles.productActions}>
                    <button
                      className={`${styles.addBtn} ${inCart ? styles.added : ''}`}
                      onClick={() => handleToggleCart(recProduct)}
                      title={inCart ? `Убрать из корзины (${inCart.quantity})` : "Добавить в корзину"}
                    >
                      {inCart ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className={styles.continueBtn} onClick={onClose}>
          Продолжить покупки
        </button>
      </div>
    </div>
  );
}

export default ProductRecommendation;
