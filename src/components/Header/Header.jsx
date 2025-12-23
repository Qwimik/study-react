import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './css/Header.module.css';

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <Link to="/" className={styles.logo}>News & Notes</Link>
        <nav className={styles.nav}>
          {!isAuthenticated && (
            <>
              <Link to="/news">News</Link>
              <Link to="/">SignIn</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

