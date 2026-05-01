import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../hooks/CartContext';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import ProductRecommendation from '../../components/ProductRecommendation/ProductRecommendation';
import { fetchProductById } from '../../services/api';
import styles from './ProductPage.module.css';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const { addToCart } = useContext(CartContext);
  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    addToCart(product);
    setShowRecommendation(true);
  }

  function handleCloseRecommendation() {
    setShowRecommendation(false);
  }

  function handleAddRecommendedProduct(recommendedProduct) {
    addToCart(recommendedProduct);
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Товар не найден</h2>
        <Link to="/menu" className={styles.backLink}>Вернуться в меню</Link>
      </div>
    );
  }

  return (
    <main className={styles.productPage}>
      <div className={styles.container}>
        {/* Хлебные крошки */}
        <div className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <span> / </span>
          <Link to="/menu">Меню</Link>
          <span> / </span>
          <span>{product.name}</span>
        </div>

        {/* Информация о товаре */}
        <div className={styles.productInfo}>
          {/* Изображение */}
          <div className={styles.imageSection}>
            <div className={styles.image}>
              {product.image ? (
                <img src={product.image} alt={product.name} className={styles.productImg} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>Фото товара</span>
                </div>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className={styles.details}>
            {product.isNew && (
              <span className={styles.badge}>Новинка</span>
            )}

            <h1 className={styles.productName}>{product.name}</h1>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.price}>{product.price} ₽</div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Добавить в корзину
            </button>
          </div>
        </div>

        {/* Пищевая ценность */}
        <section className={styles.nutrition}>
          <h2 className={styles.sectionTitle}>Пищевая ценность</h2>
          <div className={styles.nutritionGrid}>
            <div className={styles.nutritionItem}>
              <div className={styles.nutritionValue}>{product.nutrition.calories}</div>
              <div className={styles.nutritionLabel}>ккал</div>
            </div>
            <div className={styles.nutritionItem}>
              <div className={styles.nutritionValue}>{product.nutrition.proteins} г</div>
              <div className={styles.nutritionLabel}>белки</div>
            </div>
            <div className={styles.nutritionItem}>
              <div className={styles.nutritionValue}>{product.nutrition.fats} г</div>
              <div className={styles.nutritionLabel}>жиры</div>
            </div>
            <div className={styles.nutritionItem}>
              <div className={styles.nutritionValue}>{product.nutrition.carbs} г</div>
              <div className={styles.nutritionLabel}>углеводы</div>
            </div>
          </div>
        </section>

        {/* Кнопка назад */}
        <div className={styles.backSection}>
          <Link to="/menu" className={styles.backBtn}>
            ← Вернуться в меню
          </Link>
        </div>
      </div>

      {/* Модальное окно с рекомендациями */}
      {showRecommendation && (
        <ProductRecommendation
          product={product}
          onClose={handleCloseRecommendation}
          onAddToCart={handleAddRecommendedProduct}
        />
      )}
    </main>
  );
}

export default ProductPage;

