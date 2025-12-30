import React, { useState, useMemo, useEffect } from 'react';
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
    sort: 'price_asc',
    rentType: 'long'
};

export default function Rent() {
    const { t } = useLanguage();
    const { filters, setFilters, currentPage, setPage, clearFilters } = usePropertyFilters('rent', INITIAL_DEFAULTS);
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
            setTotalItems(undefined);

            try {
                const {
                    location: uiTowns = [],
                    bedrooms: uiBeds = [],
                    type: uiSubtypes = [],
                    amenities: uiAmenities = [],
                    ...rest
                } = filters;

                // --- Smart Search for Area/Town Names (Accent Insensitive) ---
                let finalTowns = [...uiTowns];
                let activeSearch = rest.search || '';

                const normalizeLoc = (str) =>
                    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

                if (activeSearch.trim()) {
                    const normalizedSearch = normalizeLoc(activeSearch);
                    let foundCanonicalName = null;

                    for (const [town, areas] of Object.entries(staticLocations)) {
                        if (normalizeLoc(town) === normalizedSearch) {
                            foundCanonicalName = town;
                            break;
                        }
                        const matchingArea = areas.find(a => normalizeLoc(a) === normalizedSearch);
                        if (matchingArea) {
                            foundCanonicalName = matchingArea;
                            break;
                        }
                    }

                    if (foundCanonicalName) {
                        if (!finalTowns.includes(foundCanonicalName)) {
                            finalTowns.push(foundCanonicalName);
                        }
                        activeSearch = '';
                    }
                }

                const params = {
                    ...rest,
                    search: activeSearch || undefined,
                    type: 'Rent',
                    page: currentPage,
                    limit: 24,
                    subtype: uiSubtypes.length ? uiSubtypes.join(',') : undefined,
                    amenities: uiAmenities.length ? uiAmenities : undefined,
                    ids: filters.ids && filters.ids.length ? filters.ids.join(',') : undefined,
                    town: finalTowns.length ? finalTowns : undefined,
                    beds: uiBeds.length ? uiBeds.map(b => b === 'studio' ? 0 : b) : undefined,
                    beds_exact: uiBeds.length ? 'true' : undefined
                };

                // Hint for Málaga narrow down
                if (finalTowns.some(t => normalizeLoc(t) === 'malaga') && !params.search) {
                    params.search = 'Málaga';
                }

                const response = await getProperties(params);
                if (!isCancelled) {
                    let finalData = response.data || [];

                    // Safety check for town matching (Accent Insensitive)
                    if (finalTowns.length > 0) {
                        finalData = finalData.filter(p =>
                            finalTowns.some(t => normalizeLoc(t) === normalizeLoc(p.town))
                        );
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
                if (!isCancelled) console.error('Failed to load rent properties:', error);
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
        <div className="rent-page">
            <div className="filters-section">
                <div className="container">
                    <PropertyFilters
                        pageType="rent"
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
                        <h2 className="listing-title">{t('pages.rent.title')}</h2>
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
