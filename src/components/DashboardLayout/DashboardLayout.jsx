import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../ConfirmModal';
import styles from './css/DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      closeSidebar();
    }
  };

  return (
    <div className={styles.layout}>
      <button
        className={`${styles.hamburger} ${isSidebarOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.open : ''}`}
        onClick={closeSidebar}
        onKeyDown={handleOverlayKeyDown}
        role="button"
        tabIndex={isSidebarOpen ? 0 : -1}
        aria-label="Close menu"
      ></div>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <nav>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive ? `${styles['menu-item']} ${styles.active}` : styles['menu-item']
            }
            onClick={closeSidebar}
          >
            Personal Information
          </NavLink>
          <NavLink
            to="/dashboard/notes"
            className={({ isActive }) =>
              isActive ? `${styles['menu-item']} ${styles.active}` : styles['menu-item']
            }
            onClick={closeSidebar}
          >
            My Notes
          </NavLink>
          <NavLink
            to="/dashboard/news"
            className={({ isActive }) =>
              isActive ? `${styles['menu-item']} ${styles.active}` : styles['menu-item']
            }
            onClick={closeSidebar}
          >
            News
          </NavLink>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              isActive ? `${styles['menu-item']} ${styles.active}` : styles['menu-item']
            }
            onClick={closeSidebar}
          >
            Users
          </NavLink>
          <button
            onClick={() => {
              closeSidebar();
              handleLogoutClick();
            }}
            className={`${styles['menu-item']} ${styles['logout-button']}`}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className={styles.content}>{children}</main>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isDanger={true}
      />
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;

