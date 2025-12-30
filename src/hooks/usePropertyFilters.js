import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function usePropertyFilters(pageType, initialDefaults = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse initial filters from URL or use defaults
    const pendingFilters = useMemo(() => {
        const filters = { ...initialDefaults };

        // Helper to get array from params
        const getArray = (key) => {
            const val = searchParams.get(key);
            if (!val) return [];
            return val.split(',');
        };

        if (searchParams.has('search')) filters.search = searchParams.get('search');
        if (searchParams.has('type')) filters.type = getArray('type');
        if (searchParams.has('bedrooms')) filters.bedrooms = getArray('bedrooms');
        if (searchParams.has('baths')) filters.baths = Number(searchParams.get('baths')) || '';
        if (searchParams.has('amenities')) filters.amenities = getArray('amenities');
        if (searchParams.has('priceMin')) filters.priceMin = Number(searchParams.get('priceMin')) || '';
        if (searchParams.has('priceMax')) filters.priceMax = Number(searchParams.get('priceMax')) || '';
        if (searchParams.has('sizeMin')) filters.sizeMin = Number(searchParams.get('sizeMin')) || '';
        if (searchParams.has('sizeMax')) filters.sizeMax = Number(searchParams.get('sizeMax')) || '';
        if (searchParams.has('sort')) filters.sort = searchParams.get('sort');
        if (searchParams.has('location')) filters.location = getArray('location');
        if (searchParams.has('rentType')) filters.rentType = searchParams.get('rentType');
        if (searchParams.has('market')) filters.market = searchParams.get('market');
        if (searchParams.has('polygon')) filters.polygon = searchParams.get('polygon');
        if (searchParams.has('ids')) filters.ids = getArray('ids');

        return filters;
    }, [searchParams, initialDefaults]);

    const [filters, setFiltersState] = useState(pendingFilters);

    // Initial sync from URL (ensure state matches URL on mount/update)
    useEffect(() => {
        // We only update state from URL if the URL params change externally (e.g. back button)
        // But preventing loops is key. 
        // For simplicity, we trust URL as source of truth on mount, and then state drives URL.
        // Actually, let's keep it simple: State is source of truth, URL is side effect? 
        // Or URL is source of truth?
        // Better: URL is source of truth.
        setFiltersState(pendingFilters);
    }, [pendingFilters]);


    // Page state
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const setPage = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page.toString());
        setSearchParams(newParams);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    // Update URL when filters change
    const updateUrl = useCallback((newFilters) => {
        const params = new URLSearchParams();

        if (newFilters.search) params.set('search', newFilters.search);
        if (newFilters.type?.length) params.set('type', newFilters.type.join(','));
        if (newFilters.bedrooms?.length) params.set('bedrooms', newFilters.bedrooms.join(','));
        if (newFilters.baths) params.set('baths', newFilters.baths);
        if (newFilters.amenities?.length) params.set('amenities', newFilters.amenities.join(','));
        if (newFilters.location?.length) params.set('location', newFilters.location.join(','));
        if (newFilters.priceMin) params.set('priceMin', newFilters.priceMin);
        if (newFilters.priceMax) params.set('priceMax', newFilters.priceMax);
        if (newFilters.sizeMin) params.set('sizeMin', newFilters.sizeMin);
        if (newFilters.sizeMax) params.set('sizeMax', newFilters.sizeMax);
        if (newFilters.sort) params.set('sort', newFilters.sort);
        if (newFilters.rentType) params.set('rentType', newFilters.rentType);
        if (newFilters.rentType) params.set('rentType', newFilters.rentType);
        if (newFilters.market) params.set('market', newFilters.market);
        if (newFilters.polygon) params.set('polygon', newFilters.polygon);
        if (newFilters.ids?.length) params.set('ids', newFilters.ids.join(','));

        // Reset to page 1 on filter change
        params.set('page', '1');

        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    // setFilters wrapper
    const setFilters = (newFilters) => {
        setFiltersState(newFilters); // Immediate UI update
        updateUrl(newFilters); // Sync to URL
    };

    const clearFilters = () => {
        const cleared = { ...initialDefaults };
        if (initialDefaults.type) cleared.type = []; // Should default be preserved? Usually clear all checks.
        // Let's assume clear means RESET to defaults + empty arrays.
        setFilters(cleared);
    };

    return {
        filters,
        setFilters,
        currentPage,
        setPage,
        clearFilters
    };
}
