import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../utils/storage';
import styles from './css/Users.module.css';

const Users = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsers();
      setParticipants(users);
    };
    loadUsers();
  }, []);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles['users-container']}>
      <h2>Users</h2>

      <div className={styles['users-list']}>
        {participants.length === 0 ? (
          <div className={styles['empty-state']}>
            No registered users
          </div>
        ) : (
          participants.map((participant, index) => (
            <div key={index} className={styles['user-card']}>
              <div className={styles['user-header']}>
                <div className={styles['user-avatar']}>
                  {getInitials(participant.firstName, participant.lastName)}
                </div>
                <div className={styles['user-name']}>
                  {participant.firstName} {participant.lastName}
                </div>
              </div>

              <div className={styles['user-details']}>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>Email:</span>
                  <span className={styles['detail-value']}>{participant.email}</span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>First Name:</span>
                  <span className={styles['detail-value']}>{participant.firstName}</span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>Last Name:</span>
                  <span className={styles['detail-value']}>{participant.lastName}</span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>Date of Birth:</span>
                  <span className={styles['detail-value']}>{formatDate(participant.dateOfBirth)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;


