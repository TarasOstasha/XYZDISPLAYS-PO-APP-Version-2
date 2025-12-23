import React, { useState, useEffect } from 'react';
import './VersionNotification.module.scss';

function VersionNotification() {
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'http://server:5000';

    const [showNotification, setShowNotification] = useState(false);
    const [newVersion, setNewVersion] = useState('');
    const [lastCheckedVersion, setLastCheckedVersion] = useState('');

    useEffect(() => {
        // Load the last known version from localStorage
        const storedVersion = localStorage.getItem('appVersion');
        if (storedVersion) {
            setLastCheckedVersion(storedVersion);
        }

        // Check for version updates every 30 seconds
        const checkVersion = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/version`);
                if (response.ok) {
                    const data = await response.json();
                    const currentVersion = data.version;

                    // If we have a stored version and it's different from the current one
                    if (storedVersion && storedVersion !== currentVersion) {
                        setNewVersion(currentVersion);
                        setShowNotification(true);
                    }

                    // Always check if the current version in memory is different
                    if (lastCheckedVersion && lastCheckedVersion !== currentVersion) {
                        setNewVersion(currentVersion);
                        setShowNotification(true);
                    }
                }
            } catch (error) {
                console.error('Error checking version:', error);
            }
        };

        // Check immediately on mount
        checkVersion();

        // Then check every 30 seconds
        const interval = setInterval(checkVersion, 30000);

        return () => clearInterval(interval);
    }, [API_BASE_URL, lastCheckedVersion]);

    const handleRefresh = () => {
        // Update localStorage with the new version
        localStorage.setItem('appVersion', newVersion);
        // Reload the page to get the new version
        window.location.reload();
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
        <div className="version-notification">
            <div className="version-notification-content">
                <div className="version-notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                </div>
                <div className="version-notification-message">
                    <strong>New Version Available!</strong>
                    <p>Version {newVersion} is now available. Please refresh to get the latest updates.</p>
                </div>
                <div className="version-notification-actions">
                    <button onClick={handleRefresh} className="btn-refresh">
                        Refresh Now
                    </button>
                    <button onClick={handleDismiss} className="btn-dismiss">
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VersionNotification;
