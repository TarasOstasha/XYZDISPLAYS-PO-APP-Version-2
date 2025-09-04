// Simple notification system to replace alert() calls
export class NotificationService {
  static notifications = [];
  static listeners = [];

  static addNotification(message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      timestamp: Date.now()
    };

    this.notifications.push(notification);
    this.notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  }

  static removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  static subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  static notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  static success(message, duration = 3000) {
    return this.addNotification(message, 'success', duration);
  }

  static error(message, duration = 5000) {
    return this.addNotification(message, 'error', duration);
  }

  static warning(message, duration = 4000) {
    return this.addNotification(message, 'warning', duration);
  }

  static info(message, duration = 3000) {
    return this.addNotification(message, 'info', duration);
  }
}

// React hook for using notifications
import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(NotificationService.notifications);

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    addNotification: NotificationService.addNotification.bind(NotificationService),
    removeNotification: NotificationService.removeNotification.bind(NotificationService),
    success: NotificationService.success.bind(NotificationService),
    error: NotificationService.error.bind(NotificationService),
    warning: NotificationService.warning.bind(NotificationService),
    info: NotificationService.info.bind(NotificationService)
  };
};

// Validation utilities
export const validateOrderForm = (values, rerenderOrderList) => {
  const errors = {};

  if (!values.po || values.po.trim().length === 0) {
    errors.po = 'Purchase Order number is required';
  }

  if (values.reprint === 'yes' && (!values.orderNotes || values.orderNotes.trim().length === 0)) {
    errors.orderNotes = 'Order notes are required when reprint is selected';
  }

  // Check for custom items without discount
  const hasCustomItems = rerenderOrderList.some(item => typeof item.discount === 'undefined');
  if (hasCustomItems) {
    errors.customItems = 'Please remove custom items or add proper discount information';
  }

  return errors;
};

// Error boundary helper
export const handleAsyncError = async (asyncFunction, errorMessage = 'An error occurred') => {
  try {
    return await asyncFunction();
  } catch (error) {
    console.error('Async error:', error);
    NotificationService.error(`${errorMessage}: ${error.message}`);
    throw error;
  }
};
