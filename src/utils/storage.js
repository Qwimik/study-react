const API_URL = 'http://localhost:3001/api';

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
};

export const saveUser = async (user) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to save user:', error);
    return null;
  }
};

export const updateUser = async (email, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to update user:', error);
    return null;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(email)}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to find user:', error);
    return null;
  }
};

export const getUserNotes = async (email) => {
  try {
    const response = await fetch(`${API_URL}/notes/${encodeURIComponent(email)}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get notes:', error);
    return [];
  }
};

export const saveUserNotes = async (email, notes) => {
  try {
    const response = await fetch(`${API_URL}/notes/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notes),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to save notes:', error);
    return null;
  }
};

export const getAllNews = async () => {
  try {
    const response = await fetch(`${API_URL}/news`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get news:', error);
    return [];
  }
};

export const saveNews = async (newsItem) => {
  try {
    const response = await fetch(`${API_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsItem),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to save news:', error);
    return null;
  }
};

export const deleteNews = async (newsId) => {
  try {
    const response = await fetch(`${API_URL}/news/${newsId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to delete news:', error);
    return null;
  }
};


