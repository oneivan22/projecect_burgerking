import { useState, useEffect, useRef } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import { useMenuData } from '../../hooks/useMenuData';
import { categories, subCategories } from '../../assets/products';
import styles from './MenuPage.module.css';

const categoryIcons = {
  new: './images/angus-cheddar.png',
  burgers: './images/angus-parm.png',
  rolls: './images/chicken-roll.png',
  fries: './images/king-fries.png',
  drinks: './images/evervess-cola.png',
  sauces: './images/sauce-bbq.png',
};

function MenuPage() {
  const {
    products,
    loading,
    error,
    queryCategory,
    searchQuery,
    loadProducts,
    getProductsByCategory,
    getProductsBySub,
    hasProducts,
  } = useMenuData();

  const [visibleCategory, setVisibleCategory] = useState('');
  const categoryRefs = useRef({});
  const subRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-160px 0px -60% 0px',
        threshold: 0,
      }
    );

    Object.values(categoryRefs.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [loading]);

  function scrollToCategory(categoryId) {
    const section = categoryRefs.current[categoryId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!loading && products.length > 0) {
      const firstCat = categories.find(c =>
        products.filter(p => p.category === c.id).length > 0
      );
      if (queryCategory && categories.some(c => c.id === queryCategory)) {
        setVisibleCategory(queryCategory);
      } else if (firstCat) {
        setVisibleCategory(firstCat.id);
      }
    }
  }, [loading, products, queryCategory]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <main className={styles.menuPage}>
      <div className={styles.container}>
        {/* Основной layout: sidebar + content */}
        <div className={styles.layout}>
          {/* Sidebar с категориями — всегда видимый */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarWrapper}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${visibleCategory === cat.id ? styles.active : ''}`}
                  onClick={() => scrollToCategory(cat.id)}
                >
                  <span className={styles.catIcon}>
                    <img src={categoryIcons[cat.id] || './images/placeholder.svg'} alt={cat.name} />
                  </span>
                  <span className={styles.catName}>{cat.name}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Контент */}
          <div className={styles.content}>
            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorMessage message={error} onRetry={loadProducts} />
            ) : !hasProducts ? (
              <div className={styles.emptyState}>
                <h2>Товары не найдены</h2>
                {searchQuery ? (
                  <p>По запросу «{searchQuery}» не найдено подходящих товаров.</p>
                ) : (
                  <p>Товары не найдены. Попробуй выбрать другую категорию.</p>
                )}
              </div>
            ) : (
              <>
                {/* Секция для каждой категории */}
                {categories.map(category => {
                  const categoryProducts = getProductsByCategory(category.id);

                  if (categoryProducts.length === 0 && category.id !== 'coupons') return null;

                  const subs = subCategories[category.id] || [];

                  return (
                    <section
                      key={category.id}
                      className={styles.categorySection}
                      ref={el => (categoryRefs.current[category.id] = el)}
                      id={category.id}
                    >
                      {/* Заголовок категории */}
                      <h2 className={styles.categoryHeading}>
                        {category.name}
                      </h2>

                      {/* Разделитель между категориями */}
                      <div className={styles.categorySeparator} />

                      {/* Товары — единым списком, сгруппированные по подкатегориям */}
                      {subs.length > 0 && categoryProducts.length > 1 ? (
                        subs.map(sub => {
                          const subProducts = getProductsBySub(sub.id);
                          if (subProducts.length === 0) return null;

                          return (
                            <div
                              key={sub.id}
                              className={styles.subSection}
                              ref={el => (subRefs.current[sub.id] = el)}
                            >
                              {/* Подзаголовок подкатегории */}
                              <h3 className={styles.subHeading}>
                                {sub.name}
                              </h3>

                              {/* Разделитель */}
                              <div className={styles.separator} />

                              {/* Сетка товаров */}
                              <div className={styles.productsGrid}>
                                {subProducts.map(product => (
                                  <ProductCard key={product.id} product={product} />
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={styles.productsGrid}>
                          {categoryProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MenuPage;

