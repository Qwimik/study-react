import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllNews, saveNews } from '../../utils/storage';
import styles from './css/News.module.css';

const News = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [news, setNews] = useState([]);
  const [showMyNews, setShowMyNews] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (selectedNews) {
          setSelectedNews(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedNews]);

  const loadNews = async () => {
    const allNews = await getAllNews();
    setNews(allNews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'News title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'News content is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newNewsItem = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      authorEmail: currentUser.email,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      publishDate: new Date().toISOString(),
    };

    await saveNews(newNewsItem);
    await loadNews();

    setFormData({
      title: '',
      content: '',
    });
    setErrors({});
    setShowAddForm(false);
  };

  const getFilteredAndSortedNews = () => {
    let filtered = news;

    if (showMyNews && currentUser) {
      filtered = filtered.filter(item => item.authorEmail === currentUser.email);
    }

    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const displayedNews = getFilteredAndSortedNews();

  return (
    <div className={styles['news-container']}>
      <h2 className={styles['news-title']}>News Catalog</h2>

      {isAuthenticated && (
        <>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className={`${styles.btn} ${styles['btn-primary']}`}
              style={{ marginBottom: '20px' }}
            >
              Add News
            </button>
          ) : (
            <div className={styles['add-news-form']}>
              <h3>Add News</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles['form-group']}>
                  <label htmlFor="title">News Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <div className={styles['error-message']}>{errors.title}</div>
                  )}
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="content">News Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                  />
                  {errors.content && (
                    <div className={styles['error-message']}>{errors.content}</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      <div className={styles.controls}>
        {isAuthenticated && (
          <div className={styles['checkbox-group']}>
            <label>
              <input
                type="checkbox"
                checked={showMyNews}
                onChange={(e) => setShowMyNews(e.target.checked)}
              />
              Show only my news
            </label>
          </div>
        )}

        <div className={styles['sort-buttons']}>
          <button
            onClick={() => setSortOrder('newest')}
            className={`${styles.btn} ${styles['btn-secondary']} ${sortOrder === 'newest' ? styles.active : ''}`}
          >
            Newest → Oldest
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`${styles.btn} ${styles['btn-secondary']} ${sortOrder === 'oldest' ? styles.active : ''}`}
          >
            Oldest → Newest
          </button>
        </div>
      </div>

      <div className={styles['news-list']}>
        {displayedNews.length === 0 ? (
          <div className={styles['empty-state']}>
            No news to display
          </div>
        ) : (
          displayedNews.map(item => (
            <div
              key={item.id}
              className={styles['news-card']}
              onClick={() => setSelectedNews(item)}
            >
              <div className={styles['news-header']}>
                <h3 className={styles['news-card-title']}>{item.title}</h3>
                <div className={styles['news-meta']}>
                  <span>📅 {formatDate(item.publishDate)}</span>
                  <span>✍️ {item.authorName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedNews && (
        <div className={styles['modal-overlay']} onClick={() => setSelectedNews(null)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles['modal-close']}
              onClick={() => setSelectedNews(null)}
            >
              ×
            </button>
            <h2 className={styles['modal-title']}>{selectedNews.title}</h2>
            <div className={styles['modal-аmeta']}>
              <span>📅 {formatDate(selectedNews.publishDate)}</span>
              <span>✍️ {selectedNews.authorName}</span>
            </div>
            <div className={styles['modal-body']}>{selectedNews.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;

