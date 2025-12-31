import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fyr_favorites';

export default function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse favorites', e);
            return [];
        }
    });

    // Listen for updates from other components/tabs
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                const newFavs = stored ? JSON.parse(stored) : [];

                setFavorites(current => {
                    if (JSON.stringify(current) === JSON.stringify(newFavs)) {
                        return current;
                    }
                    return newFavs;
                });
            } catch (e) {
                console.error('Failed to sync favorites', e);
            }
        };

        window.addEventListener('favorites-updated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('favorites-updated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Persist changes and notify others
    useEffect(() => {
        try {
            const currentStored = localStorage.getItem(STORAGE_KEY);
            const newSerialized = JSON.stringify(favorites);

            if (currentStored !== newSerialized) {
                localStorage.setItem(STORAGE_KEY, newSerialized);
                window.dispatchEvent(new Event('favorites-updated'));
            }
        } catch (e) {
            console.error('Failed to save favorites', e);
        }
    }, [favorites]);

    const toggleFavorite = useCallback((id) => {
        setFavorites(prev => {
            if (prev.includes(id)) {
                return prev.filter(fid => fid !== id);
            }
            return [...prev, id];
        });
    }, []);

    const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

    const getFavorites = useCallback(() => favorites, [favorites]);

    return { favorites, toggleFavorite, isFavorite, getFavorites };
}
