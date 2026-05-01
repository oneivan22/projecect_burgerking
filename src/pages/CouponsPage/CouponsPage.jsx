import { useState, useContext } from 'react';
import { CartContext } from '../../hooks/CartContext';
import styles from './CouponsPage.module.css';

function CouponsPage() {
  const { promoCode, setPromoCode } = useContext(CartContext);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleApply() {
    if (code === 'promo10') {
      setPromoCode('promo10');
      setError('');
      alert('Скидка 10% применена!');
    } else {
      setError('Неверный код');
    }
  }

  function handleRemove() {
    setPromoCode('');
    setCode('');
    setError('');
  }

  return (
    <main className={styles.couponsPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Промокод</h1>
          
          {promoCode === 'promo10' ? (
            <div>
              <p className={styles.text}>Код: <strong>promo10</strong></p>
              <p className={styles.text}>Скидка: 10% на всю покупку</p>
              <button className={styles.btn} onClick={handleRemove}>
                Удалить код
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                className={styles.input}
                placeholder="Введи промокод"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <p className={styles.errorMsg}>{error}</p>}
              <button className={styles.btn} onClick={handleApply}>
                Применить
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CouponsPage;

