import React, { useState, useEffect } from 'react';
import styles from './VersionNotification.module.scss';

function VersionNotification() {
    // Support both localhost:3000 (client) and localhost:5000 (server direct access)
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? (window.location.port === '5000' ? 'http://localhost:5000' : 'http://localhost:5000')
        : 'http://server:5000';

    const [showNotification, setShowNotification] = useState(false);
    const [newVersion, setNewVersion] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        // Check for version updates every 30 seconds
        const checkVersion = async () => {
            try {
                // Check FTP version (source of truth)
                const response = await fetch(`${API_BASE_URL}/api/ftpVersion`);
                if (response.ok) {
                    const data = await response.json();
                    const ftpVersion = data.version;
                    
                    // Get the stored version from localStorage
                    const storedVersion = localStorage.getItem('appVersion');

                    if (!storedVersion) {
                        // First time running - save the current version without showing notification
                        localStorage.setItem('appVersion', ftpVersion);
                        console.log('✅ Initial version set from FTP:', ftpVersion);
                    } else if (storedVersion !== ftpVersion) {
                        // Version has changed on FTP - show notification
                        console.log('🔔 New version detected on FTP:', ftpVersion, 'Old version:', storedVersion);
                        setNewVersion(ftpVersion);
                        setShowNotification(true);
                    } else {
                        console.log('✅ Version up to date:', ftpVersion);
                    }
                }
            } catch (error) {
                console.error('❌ Error checking version from FTP:', error);
            }
        };

        // Check immediately on mount
        checkVersion();

        // Then check every 30 seconds
        const interval = setInterval(checkVersion, 30000);

        return () => clearInterval(interval);
    }, [API_BASE_URL]);

    const pollProgress = () => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/updateFolder/progress`);
                const data = await res.json();
                setProgress(data);
        
                if (data.complete) {
                    clearInterval(interval);
                    // Update localStorage with the new version
                    localStorage.setItem('appVersion', newVersion);
                    console.log('Download complete! Reloading page...');
                    // Reload the page to get the new version
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.error('Error polling progress:', error);
            }
        }, 1000);
    };

    const handleRefresh = async () => {
        setIsUpdating(true);
        setProgress(null);
        
        try {
            // Trigger the same update process as "Update APP" button
            const response = await fetch(`${API_BASE_URL}/api/updateFolder`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Update initiated:', data.message);
                
                // Start polling progress
                pollProgress();
            } else {
                const errorData = await response.json();
                console.error('Update error:', errorData.message);
                alert(`Error updating: ${errorData.message}`);
                setIsUpdating(false);
                setProgress(null);
            }
        } catch (error) {
            console.error('Error updating app:', error);
            alert('Error updating app. Please try again later.');
            setIsUpdating(false);
            setProgress(null);
        }
    };

    const handleDismiss = () => {
        // Update localStorage with the new version and dismiss
        localStorage.setItem('appVersion', newVersion);
        setShowNotification(false);
    };

    if (!showNotification) {
        return null;
    }

    return (
        <div className={styles['version-notification']}>
            <div className={styles['version-notification-content']}>
                <div className={styles['version-notification-icon']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                </div>
                <div className={styles['version-notification-message']}>
                    <strong>{isUpdating ? 'Updating...' : 'New Version Available!'}</strong>
                    {!isUpdating && (
                        <p>Version {newVersion} is now available. Please refresh to get the latest updates.</p>
                    )}
                    {isUpdating && !progress && (
                        <p>Starting download...</p>
                    )}
                    {isUpdating && progress && (
                        <>
                            <div className={styles['progress-bar-container']}>
                                <div 
                                    className={styles['progress-bar']}
                                    style={{ width: `${progress.totalFiles > 0 ? (progress.downloaded / progress.totalFiles) * 100 : 0}%` }}
                                />
                            </div>
                            <p className={styles['progress-text']}>
                                Downloaded {progress.downloaded} of {progress.totalFiles} files
                                {progress.currentFile && ` (${progress.currentFile})`}
                            </p>
                        </>
                    )}
                </div>
                <div className={styles['version-notification-actions']}>
                    <button 
                        onClick={handleRefresh} 
                        className={styles['btn-refresh']}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Refresh Now'}
                    </button>
                    <button 
                        onClick={handleDismiss} 
                        className={styles['btn-dismiss']}
                        disabled={isUpdating}
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VersionNotification;
