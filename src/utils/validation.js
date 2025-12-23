export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  return '';
};

export const validateName = (name, fieldName = 'Field') => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }

  const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} must not contain special characters`;
  }

  return '';
};

export const validateDateOfBirth = (date) => {
  if (!date || date.trim() === '') {
    return 'Date of birth is required';
  }

  const birthDate = new Date(date);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return 'Invalid date';
  }

  if (birthDate > today) {
    return 'Date of birth cannot be in the future';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 16) {
    return 'You must be at least 16 years old';
  }

  return '';
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Password confirmation is required';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return '';
};

