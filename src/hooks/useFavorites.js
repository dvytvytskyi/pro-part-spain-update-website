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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        // Dispatch custom event for other components to sync if needed
        window.dispatchEvent(new Event('favorites-updated'));
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
