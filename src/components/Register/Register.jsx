import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validateName,
  validateDateOfBirth,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';
import { saveUser, findUserByEmail } from '../../utils/storage';
import styles from './css/Auth.module.css';

const Register = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const debounceTimers = useRef({});

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
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
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMessage('');

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

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const existingUser = await findUserByEmail(formData.email);
    if (existingUser) {
      setErrors({ email: 'User with this email already exists' });
      return;
    }

    const newUser = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      password: formData.password,
    };

    await saveUser(newUser);
    setSuccessMessage('Registration successful! Logging in...');

    setTimeout(async () => {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-box']}>
        <h2>Registration</h2>

        {successMessage && (
          <div className={styles['success-message']}>{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className={styles['error-message']}>{errors.email}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <div className={styles['error-message']}>{errors.firstName}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <div className={styles['error-message']}>{errors.lastName}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div className={styles['error-message']}>{errors.dateOfBirth}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className={styles['error-message']}>{errors.password}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className={styles['error-message']}>{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className={styles['auth-button']}>
            Register
          </button>
        </form>

        <div className={styles['toggle-form']}>
          Already have an account?
          <button type="button" onClick={onToggleForm}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

