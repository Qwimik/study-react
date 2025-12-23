import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserNotes, saveUserNotes } from '../../utils/storage';
import ConfirmModal from '../../components/ConfirmModal';
import styles from './css/Notes.module.css';

const CATEGORIES = {
  ALL: 'All Notes',
  URGENT: 'Urgent',
  DEFAULT: 'Default',
  CAN_WAIT: 'Can Wait',
};

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'DEFAULT',
  });
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      if (currentUser) {
        const userNotes = await getUserNotes(currentUser.email);
        setNotes(userNotes);
      }
    };
    loadNotes();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSelectOpen && !event.target.closest(`.${styles['custom-select']}`)) {
        setIsSelectOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isSelectOpen) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isSelectOpen]);

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
      newErrors.title = 'Note title is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Note body is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
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

    const newNote = {
      id: Date.now(),
      title: formData.title,
      body: formData.body,
      category: formData.category,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await saveUserNotes(currentUser.email, updatedNotes);

    setFormData({
      title: '',
      body: '',
      category: 'DEFAULT',
    });
    setErrors({});
  };

  const deleteNote = (noteId) => {
    setNoteToDelete(noteId);
    setShowDeleteNoteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete);
      setNotes(updatedNotes);
      await saveUserNotes(currentUser.email, updatedNotes);
    }
    setShowDeleteNoteModal(false);
    setNoteToDelete(null);
  };

  const cancelDeleteNote = () => {
    setShowDeleteNoteModal(false);
    setNoteToDelete(null);
  };

  const deleteAllInCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteAll = async () => {
    if (categoryToDelete) {
      let updatedNotes;
      if (categoryToDelete === 'ALL') {
        updatedNotes = [];
      } else {
        updatedNotes = notes.filter(note => note.category !== categoryToDelete);
      }
      setNotes(updatedNotes);
      await saveUserNotes(currentUser.email, updatedNotes);
    }
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const cancelDeleteAll = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const getNotesByCategory = (category) => {
    if (category === 'ALL') {
      return notes;
    }
    return notes.filter(note => note.category === category);
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'URGENT':
        return styles.urgent;
      case 'CAN_WAIT':
        return styles['can-wait'];
      default:
        return styles.default;
    }
  };

  return (
    <div className={styles['notes-container']}>
      <h2>My Notes</h2>

      <div className={styles['add-note-form']}>
        <h3>Add Note</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="title">Note Title</label>
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
            <label htmlFor="body">Note Body</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
            />
            {errors.body && (
              <div className={styles['error-message']}>{errors.body}</div>
            )}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="category">Category</label>
            <div className={styles['custom-select']}>
              <div
                className={`${styles['select-selected']} ${isSelectOpen ? styles.active : ''}`}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                {CATEGORIES[formData.category]}
                <span className={styles['select-arrow']}>▼</span>
              </div>
              {isSelectOpen && (
                <div className={styles['select-items']}>
                  <div
                    className={`${styles['select-option']} ${formData.category === 'URGENT' ? styles.selected : ''}`}
                    onClick={() => {
                      handleChange({ target: { name: 'category', value: 'URGENT' } });
                      setIsSelectOpen(false);
                    }}
                  >
                    {CATEGORIES.URGENT}
                  </div>
                  <div
                    className={`${styles['select-option']} ${formData.category === 'DEFAULT' ? styles.selected : ''}`}
                    onClick={() => {
                      handleChange({ target: { name: 'category', value: 'DEFAULT' } });
                      setIsSelectOpen(false);
                    }}
                  >
                    {CATEGORIES.DEFAULT}
                  </div>
                  <div
                    className={`${styles['select-option']} ${formData.category === 'CAN_WAIT' ? styles.selected : ''}`}
                    onClick={() => {
                      handleChange({ target: { name: 'category', value: 'CAN_WAIT' } });
                      setIsSelectOpen(false);
                    }}
                  >
                    {CATEGORIES.CAN_WAIT}
                  </div>
                </div>
              )}
            </div>
            {errors.category && (
              <div className={styles['error-message']}>{errors.category}</div>
            )}
          </div>

          <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
            Add Note
          </button>
        </form>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'ALL' ? styles.active : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          {CATEGORIES.ALL} ({notes.length})
        </button>
        {Object.keys(CATEGORIES).filter(cat => cat !== 'ALL').map(category => (
          <button
            key={category}
            className={`${styles.tab} ${activeTab === category ? styles.active : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {CATEGORIES[category]} ({getNotesByCategory(category).length})
          </button>
        ))}
      </div>

      <div className={styles['notes-section']}>
        <h3>
          {CATEGORIES[activeTab]}
          {getNotesByCategory(activeTab).length > 0 && (
            <button
              onClick={() => deleteAllInCategory(activeTab)}
              className={`${styles.btn} ${styles['btn-danger']}`}
            >
              Delete All
            </button>
          )}
        </h3>

        <div className={styles['notes-list']}>
          {getNotesByCategory(activeTab).length === 0 ? (
            <div className={styles['empty-state']}>
              No notes in this category
            </div>
          ) : (
            getNotesByCategory(activeTab).map(note => (
              <div key={note.id} className={`${styles['note-card']} ${getCategoryClass(note.category)}`}>
                <div className={styles['note-header']}>
                  <div className={styles['note-title']}>{note.title}</div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className={styles['btn-delete']}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
                <div className={styles['note-body']}>{note.body}</div>
                <span className={styles['note-category']}>{CATEGORIES[note.category]}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message={
          categoryToDelete === 'ALL'
            ? 'Are you sure you want to delete all notes?'
            : `Are you sure you want to delete all notes in the "${categoryToDelete ? CATEGORIES[categoryToDelete] : ''}" category?`
        }
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={confirmDeleteAll}
        onCancel={cancelDeleteAll}
        isDanger={true}
      />

      <ConfirmModal
        isOpen={showDeleteNoteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteNote}
        onCancel={cancelDeleteNote}
        isDanger={true}
      />
    </div>
  );
};

export default Notes;

