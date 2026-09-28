import React from 'react';
import { useNotifications } from '../utils/notifications';
import styles from './NotificationContainer.module.scss';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className={styles.notificationContent}>
            <span className={styles.notificationMessage}>
              {notification.message}
            </span>
            <button
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
