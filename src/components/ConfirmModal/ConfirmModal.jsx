import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './css/ConfirmModal.module.css';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']} onClick={onCancel}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles['modal-title']}>{title}</h3>
        <p className={styles['modal-message']}>{message}</p>
        <div className={styles['modal-buttons']}>
          <button
            onClick={onConfirm}
            className={`${styles.btn} ${isDanger ? styles['btn-danger'] : styles['btn-primary']}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className={`${styles.btn} ${styles['btn-secondary']}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDanger: PropTypes.bool,
};

export default ConfirmModal;

