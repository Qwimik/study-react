import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../utils/storage';
import {
  validateName,
  validateDateOfBirth,
  validatePassword,
} from '../../utils/validation';
import styles from './css/Profile.module.css';

const Profile = () => {
  const { currentUser, updateCurrentUser, refreshCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const debounceTimers = useRef({});

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(value, 'First name');
        break;
      case 'lastName':
        error = validateName(value, 'Last name');
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(value);
        break;
      case 'password':
        if (value) {
          error = validatePassword(value);
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (debounceTimers.current[name]) {
      clearTimeout(debounceTimers.current[name]);
    }

    debounceTimers.current[name] = setTimeout(() => {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }, 500);
  };

  const validate = () => {
    const newErrors = {};

    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;

    if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    return newErrors;
  };

  const handleEdit = () => {
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      dateOfBirth: currentUser.dateOfBirth,
      password: '',
    });
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
    };

    if (formData.password) {
      updatedData.password = formData.password;
    }

    const updated = await updateUser(currentUser.email, updatedData);
    if (updated) {
      updateCurrentUser(updatedData);
      await refreshCurrentUser();
      setIsEditing(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className={styles['profile-container']}>
      <h2>Personal Information</h2>

      {!isEditing ? (
        <>
          <div className={styles['profile-info']}>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Email:</span>
              <span className={styles['info-value']}>{currentUser.email}</span>
            </div>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>First Name:</span>
              <span className={styles['info-value']}>{currentUser.firstName}</span>
            </div>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Last Name:</span>
              <span className={styles['info-value']}>{currentUser.lastName}</span>
            </div>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Date of Birth:</span>
              <span className={styles['info-value']}>{currentUser.dateOfBirth}</span>
            </div>
          </div>

          <div className={styles['button-group']}>
            <button onClick={handleEdit} className={`${styles.btn} ${styles['btn-primary']}`}>
              Edit
            </button>
          </div>
        </>
      ) : (
        <div className={styles['edit-form']}>
          <div className={styles['form-group']}>
            <label>Email (cannot be edited)</label>
            <input type="text" value={currentUser.email} disabled />
          </div>

          <div className={styles['form-group']}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <div className={styles['error-message']}>{errors.firstName}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <div className={styles['error-message']}>{errors.lastName}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div className={styles['error-message']}>{errors.dateOfBirth}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label>New Password (leave empty if you don't want to change)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className={styles['error-message']}>{errors.password}</div>
            )}
          </div>

          <div className={styles['button-group']}>
            <button onClick={handleSave} className={`${styles.btn} ${styles['btn-primary']}`}>
              Save
            </button>
            <button onClick={handleCancel} className={`${styles.btn} ${styles['btn-secondary']}`}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

