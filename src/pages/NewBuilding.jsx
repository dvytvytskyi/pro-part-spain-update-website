import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePropertyFilters from '../hooks/usePropertyFilters';
import PropertyFilters from '../components/listing/PropertyFilters';
import PropertyGrid from '../components/listing/PropertyGrid';
import { getProperties, getFilterOptions } from '../api/client';
import { sortProperties } from '../utils/propertyHelpers';
import { useLanguage } from '../i18n/LanguageContext';
import '../components/listing/ListingComponents.css';
import { staticLocations } from '../data/staticLocations';

const INITIAL_DEFAULTS = {
    search: '',
    type: [],
    location: [],
    bedrooms: [],
    amenities: [],
    priceMin: '',
    priceMax: '',
    sizeMin: '',
    sizeMax: '',
    sort: 'price_asc'
};

export default function NewBuilding() {
    const { t } = useLanguage();
    const { filters, setFilters, currentPage, setPage, clearFilters } = usePropertyFilters('new-building', INITIAL_DEFAULTS);
    const [isLoading, setIsLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();

    // Save scroll position on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!isLoading) {
                sessionStorage.setItem(`scroll_${location.pathname}`, window.scrollY.toString());
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, isLoading]);

    // Fetch properties
    useEffect(() => {
        let isCancelled = false;

        const fetchProperties = async () => {
            setIsLoading(true);
            setTotalItems(undefined); // Hide count while loading

            try {
                const {
                    location: uiTowns = [],
                    bedrooms: uiBeds = [],
                    type: uiSubtypes = [],
                    amenities: uiAmenities = [],
                    ...rest
                } = filters;

                const params = {
                    ...rest,
                    type: 'Off-Plan',
                    page: currentPage,
                    limit: 24,
                    subtype: uiSubtypes.length ? uiSubtypes.join(',') : undefined,
                    amenities: uiAmenities.length ? uiAmenities : undefined,
                    ids: filters.ids && filters.ids.length ? filters.ids.join(',') : undefined,
                    town: uiTowns.length ? uiTowns : undefined,
                    beds: uiBeds.length ? uiBeds.map(b => b === 'studio' ? 0 : b) : undefined,
                    beds_exact: uiBeds.length ? 'true' : undefined
                };

                // Hint for Málaga narrow down
                if (uiTowns.includes('Málaga') && !params.search) {
                    params.search = 'Málaga';
                }

                const response = await getProperties(params);
                if (!isCancelled) {
                    let finalData = response.data || [];

                    // Safety check for town matching
                    if (uiTowns.length > 0) {
                        finalData = finalData.filter(p => uiTowns.includes(p.town));
                    }

                    setProperties(finalData);
                    setTotalItems(response.totalItems || 0);
                    setTotalPages(response.totalPages || 0);

                    // Restore scroll position
                    const savedScroll = sessionStorage.getItem(`scroll_${location.pathname}`);
                    if (savedScroll) {
                        setTimeout(() => {
                            window.scrollTo({
                                top: parseInt(savedScroll, 10),
                                behavior: 'instant'
                            });
                        }, 50);
                    }
                }
            } catch (error) {
                if (!isCancelled) console.error('Failed to load project properties:', error);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        fetchProperties();
        return () => { isCancelled = true; };
    }, [filters, currentPage]);

    // Simple sorting
    const sortProperties = (props, sortType) => {
        return [...props].sort((a, b) => {
            const getPrice = (p) => p.price || 0;
            const getSize = (p) => p.built_area || p.total_area || p.size || 0;
            const getDate = (p) => new Date(p.created_at || p.createdAt || 0).getTime();

            switch (sortType) {
                case 'price_asc': return getPrice(a) - getPrice(b);
                case 'price_desc': return getPrice(b) - getPrice(a);
                case 'size_asc': return getSize(a) - getSize(b);
                case 'size_desc': return getSize(b) - getSize(a);
                case 'date_desc': return getDate(b) - getDate(a);
                default: return getDate(b) - getDate(a);
            }
        });
    };

    return (
        <div className="new-building-page">
            <div className="filters-section">
                <div className="container">
                    <PropertyFilters
                        pageType="new-building"
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearFilters={clearFilters}
                        totalCount={totalItems}
                    />
                </div>
            </div>

            <main className="main-content">
                <div className="container">
                    <div className="listing-header">
                        <h2 className="listing-title">{t('pages.newBuilding.title')}</h2>
                        <span className="listing-count">
                            {t('filters.resultsFound').replace('{count}', totalItems || 0)}
                        </span>
                    </div>

                    <PropertyGrid
                        properties={properties}
                        loading={isLoading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </main>
        </div>
    );
}
