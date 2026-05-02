import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ nickname: '', email: '' });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('bk-isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/login');
      return;
    }

    const savedProfile = localStorage.getItem('bk-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!profile.nickname.trim()) {
      alert('Введите никнейм');
      return;
    }
    if (!profile.email.trim() || !profile.email.toLowerCase().endsWith('@gmail.com')) {
      alert('Введите корректный email на @gmail.com');
      return;
    }
    localStorage.setItem('bk-profile', JSON.stringify(profile));
    alert('Профиль сохранён');
    navigate('/menu');
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.container}>
        <h1>Мой профиль</h1>

        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nickname">Никнейм</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="Ваш никнейм"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Ваш email"
            />
          </div>

          <button onClick={handleSave} className={styles.saveBtn}>
            Сохранить изменения
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
