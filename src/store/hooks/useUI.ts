import { useAppDispatch, useAppSelector } from '../hooks';
import {
  setModalOpen,
  setLoading,
  setSidebarOpen,
  setMobileMenuOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications
} from '../slices/uiSlice';
import {
  selectUIState,
  selectIsModalOpen,
  selectUILoading,
  selectSidebarOpen,
  selectMobileMenuOpen,
  selectTheme,
  selectNotifications
} from '../selectors';

export const useUI = () => {
  const dispatch = useAppDispatch();

  const uiState = useAppSelector(selectUIState);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const isLoading = useAppSelector(selectUILoading);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);
  const theme = useAppSelector(selectTheme);
  const notifications = useAppSelector(selectNotifications);

  const openModal = () => dispatch(setModalOpen(true));
  const closeModal = () => dispatch(setModalOpen(false));
  const toggleModal = () => dispatch(setModalOpen(!isModalOpen));

  const startLoading = () => dispatch(setLoading(true));
  const stopLoading = () => dispatch(setLoading(false));

  const openSidebar = () => dispatch(setSidebarOpen(true));
  const closeSidebar = () => dispatch(setSidebarOpen(false));
  const toggleSidebar = () => dispatch(setSidebarOpen(!sidebarOpen));

  const openMobileMenu = () => dispatch(setMobileMenuOpen(true));
  const closeMobileMenu = () => dispatch(setMobileMenuOpen(false));
  const toggleMobileMenu = () => dispatch(setMobileMenuOpen(!mobileMenuOpen));

  const switchTheme = (newTheme: 'light' | 'dark') => dispatch(setTheme(newTheme));
  const toggleTheme = () => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ) => {
    const notification = { type, message, duration };
    dispatch(addNotification(notification));

    // Auto-remove notification after duration
    if (duration) {
      setTimeout(() => {
        // Find the notification by message and type to remove it
        const notificationToRemove = notifications.find(
          n => n.message === message && n.type === type
        );
        if (notificationToRemove) {
          dispatch(removeNotification(notificationToRemove.id));
        }
      }, duration);
    }
  };

  const hideNotification = (id: string) => dispatch(removeNotification(id));
  const clearAllNotifications = () => dispatch(clearNotifications());

  const showSuccess = (message: string, duration = 3000) =>
    showNotification('success', message, duration);

  const showError = (message: string, duration = 5000) =>
    showNotification('error', message, duration);

  const showWarning = (message: string, duration = 4000) =>
    showNotification('warning', message, duration);

  const showInfo = (message: string, duration = 3000) =>
    showNotification('info', message, duration);

  return {
    // State
    uiState,
    isModalOpen,
    isLoading,
    sidebarOpen,
    theme,
    notifications,

    // Modal actions
    openModal,
    closeModal,
    toggleModal,

    // Loading actions
    startLoading,
    stopLoading,

    // Sidebar actions
    openSidebar,
    closeSidebar,
    toggleSidebar,

    // Mobile menu actions
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,

    // Theme actions
    switchTheme,
    toggleTheme,

    // Notification actions
    showNotification,
    hideNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
