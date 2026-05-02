import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('bk-isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError('Введите email');
      return;
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Требуется email на @gmail.com');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }
    if (isRegister && !nickname.trim()) {
      setError('Введите никнейм');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const savedProfile = localStorage.getItem('bk-profile');
      const profile = savedProfile ? JSON.parse(savedProfile) : null;

      if (isRegister) {
        const newProfile = { nickname: nickname, email: email, password: password };
        localStorage.setItem('bk-profile', JSON.stringify(newProfile));
        localStorage.setItem('bk-isLoggedIn', 'true');
        localStorage.setItem('bk-userLogin', nickname);
        setIsLoading(false);
        alert(`Регистрация успешна! Добро пожаловать, ${nickname}!`);
        navigate('/profile');
        return;
      }

      if (!profile || profile.email !== email || profile.password !== password) {
        setIsLoading(false);
        setError('Неверный email или пароль. Зарегистрируйтесь или попробуйте ещё раз.');
        return;
      }

      localStorage.setItem('bk-isLoggedIn', 'true');
      localStorage.setItem('bk-userLogin', profile.nickname || profile.email);
      setIsLoading(false);
      alert(`Добро пожаловать, ${profile.nickname}!`);
      navigate('/profile');
    }, 800);
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>{isRegister ? 'Регистрация' : 'Вход в аккаунт'}</h1>
          <p className={styles.subtitle}>{isRegister ? 'Создайте новый аккаунт' : 'Введите email и пароль'}</p>

          <div className={styles.switch}>
            <button
              type="button"
              className={!isRegister ? styles.active : ''}
              onClick={() => setIsRegister(false)}
            >
              Вход
            </button>
            <button
              type="button"
              className={isRegister ? styles.active : ''}
              onClick={() => setIsRegister(true)}
            >
              Регистрация
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <div className={styles.field}>
                <label htmlFor="nickname" className={styles.label}>Никнейм</label>
                <input
                  id="nickname"
                  type="text"
                  className={styles.input}
                  placeholder="Введите никнейм"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="example@mail.ru"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Пароль</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Введите пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? (isRegister ? 'Регистрация...' : 'Вход...') : (isRegister ? 'Зарегистрироваться' : 'Войти')}
            </button>
          </form>

          <div className={styles.backSection}>
            <a href="/" className={styles.backLink}>← Вернуться на главную</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;

