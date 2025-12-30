import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronDown, Check, X, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import LocationFilter from './LocationFilter';
import { createPortal } from 'react-dom';
import { getFilterOptions } from '../../api/client';
import {
    generateBuyPriceOptions,
    generateRentPriceOptions,
    generateSizeOptions,
    bedroomOptions,
    propertyTypes
} from '../../data/filterOptions';
import { useLanguage } from '../../i18n/LanguageContext';
import './ListingComponents.css';

export default function PropertyFilters({ pageType, filters, onFilterChange, onClearFilters, totalCount }) {
    const { t } = useLanguage();

    // Generate options based on page type
    const priceOptions = useMemo(() => {
        return pageType === 'rent' ? generateRentPriceOptions() : generateBuyPriceOptions();
    }, [pageType]);

    const sizeOptions = useMemo(() => generateSizeOptions(), []);
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    // Localize options
    const localizedPropertyTypes = useMemo(() => propertyTypes.map(opt => ({
        ...opt,
        label: t(`filters.propertyTypes.${opt.value.toLowerCase()}`)
    })), [t]);

    const localizedBedroomOptions = useMemo(() => bedroomOptions.map(opt => ({
        ...opt,
        label: opt.value === 'studio' ? t('filters.studio') : opt.label
    })), [t]);

    // Dynamic sort options
    const sortOptions = useMemo(() => [
        { value: 'recommended', label: t('filters.recommended') },
        { value: 'newest', label: t('filters.sort.newest') },
        { value: 'price_asc', label: t('filters.sort.priceAsc') },
        { value: 'price_desc', label: t('filters.sort.priceDesc') }
    ], [t]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showFiltersModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showFiltersModal]);

    const [availableAmenities, setAvailableAmenities] = useState([]);

    useEffect(() => {
        getFilterOptions().then(data => {
            if (data.amenities) {
                setAvailableAmenities(data.amenities.map(a => ({ value: a.name, label: a.name })));
            }
        });
    }, []);

    const handleSearchChange = (e) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleMultiSelect = (key, value) => {
        const current = filters[key] || [];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        onFilterChange({ ...filters, [key]: updated });
    };

    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (key) => {
        setOpenDropdown(openDropdown === key ? null : key);
    };

    const renderMultiSelect = (key, label, options, alignRight = false) => {
        const selected = filters[key] || [];
        const isActive = openDropdown === key;

        return (
            <div className="filter-dropdown-wrapper">
                <div
                    className={`filter-dropdown-trigger ${isActive ? 'active' : ''}`}
                    onClick={() => toggleDropdown(key)}
                >
                    <span className="trigger-label">
                        {selected.length > 0
                            ? (key === 'bedrooms'
                                ? [...selected].sort((a, b) => {
                                    const va = a === 'studio' ? -1 : parseInt(a, 10);
                                    const vb = b === 'studio' ? -1 : parseInt(b, 10);
                                    return va - vb;
                                }).map(v => v === 'studio' ? 'Studio' : v === '6' ? '6+' : v).join(', ')
                                : `${selected.length} ${label}`)
                            : label}
                    </span>
                    <ChevronDown size={18} className={`trigger-icon ${isActive ? 'rotate' : ''}`} />
                </div>
                {isActive && (
                    <div className={`filter-dropdown-menu ${alignRight ? 'align-right' : ''}`}>
                        {options.map(opt => (
                            <div
                                key={opt.value}
                                className="filter-item"
                                onClick={() => handleMultiSelect(key, opt.value)}
                            >
                                <div className={`checkbox-custom ${selected.includes(opt.value) ? 'checked' : ''}`}>
                                    {selected.includes(opt.value) && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="filter-item-label">{opt.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const [rangeType, setRangeType] = useState(null);

    useEffect(() => {
        setRangeType(null);
    }, [openDropdown]);

    const renderRangeFilter = (keyPrefix, label, options, unit = '', alignRight = false) => {
        const isActive = openDropdown === keyPrefix;
        const formatCompact = (val) => {
            if (!val) return '';
            return new Intl.NumberFormat('en-US', {
                notation: "compact",
                maximumFractionDigits: 1
            }).format(val);
        };

        const minVal = filters[`${keyPrefix}Min`];
        const maxVal = filters[`${keyPrefix}Max`];

        const displayLabel = (minVal || maxVal)
            ? `${minVal ? (unit + formatCompact(minVal)) : (keyPrefix === 'price' ? '0' : '0')} - ${maxVal ? (unit + formatCompact(maxVal)) : t('filters.any')}`
            : label;

        const handleRangeSelect = (type, value) => {
            onFilterChange({
                ...filters,
                [`${keyPrefix}${type === 'min' ? 'Min' : 'Max'}`]: value
            });
            setRangeType(null);
        };

        return (
            <div className="filter-dropdown-wrapper">
                <div
                    className={`filter-dropdown-trigger ${isActive ? 'active' : ''}`}
                    onClick={() => toggleDropdown(keyPrefix)}
                >
                    <span className="trigger-label">{displayLabel}</span>
                    <ChevronDown size={18} className={`trigger-icon ${isActive ? 'rotate' : ''}`} />
                </div>
                {isActive && (
                    <div className={`filter-dropdown-menu overflow-visible ${alignRight ? 'align-right' : ''}`}>
                        <div className="range-dropdown-content">
                            <div className="range-inputs">
                                <div className="range-input-group">
                                    <div
                                        className={`range-select-trigger ${rangeType === 'min' ? 'active' : ''}`}
                                        onClick={() => setRangeType(rangeType === 'min' ? null : 'min')}
                                    >
                                        <span>{minVal ? (unit + formatCompact(minVal)) : t('filters.min')}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    {rangeType === 'min' && (
                                        <div className="range-options-list">
                                            <div
                                                className="range-option"
                                                onClick={() => handleRangeSelect('min', '')}
                                            >
                                                {t('filters.min')} ({t('filters.reset')})
                                            </div>
                                            {options.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    className="range-option"
                                                    onClick={() => handleRangeSelect('min', opt.value)}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span style={{ color: '#5f5f5f' }}>-</span>
                                <div className="range-input-group">
                                    <div
                                        className={`range-select-trigger ${rangeType === 'max' ? 'active' : ''}`}
                                        onClick={() => setRangeType(rangeType === 'max' ? null : 'max')}
                                    >
                                        <span>{maxVal ? (unit + formatCompact(maxVal)) : t('filters.max')}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    {rangeType === 'max' && (
                                        <div className="range-options-list">
                                            <div
                                                className="range-option"
                                                onClick={() => handleRangeSelect('max', '')}
                                            >
                                                {t('filters.max')} ({t('filters.reset')})
                                            </div>
                                            {options.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    className="range-option"
                                                    onClick={() => handleRangeSelect('max', opt.value)}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Custom Sort Dropdown
    const renderSortDropdown = () => {
        const isActive = openDropdown === 'sort';
        const currentSortLabel = sortOptions.find(opt => opt.value === filters.sort)?.label || t('filters.recommended');

        return (
            <div className="sort-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sort-label">{t('filters.sort.label')}:</span>
                <div className="filter-dropdown-wrapper" style={{ minWidth: 'auto', flex: 'none', width: 'auto' }}>
                    <div
                        className={`filter-dropdown-trigger sort-trigger ${isActive ? 'active' : ''}`}
                        onClick={() => toggleDropdown('sort')}
                        style={{ padding: '0 0.5rem', height: 'auto', minHeight: 'auto', border: 'none', background: 'transparent' }}
                    >
                        <span className="trigger-label" style={{ fontWeight: '500', color: '#313131', marginRight: '4px' }}>
                            {currentSortLabel}
                        </span>
                        <ChevronDown size={16} className={`trigger-icon ${isActive ? 'rotate' : ''}`} />
                    </div>
                    {isActive && (
                        <div className="filter-dropdown-menu align-right" style={{ width: '200px', right: 0, left: 'auto', top: '100%' }}>
                            {sortOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    className="filter-item"
                                    onClick={() => {
                                        onFilterChange({ ...filters, sort: opt.value });
                                        toggleDropdown(null);
                                    }}
                                >
                                    <span className={`filter-item-label ${filters.sort === opt.value ? 'selected-sort' : ''}`} style={{ fontWeight: filters.sort === opt.value ? '600' : '400' }}>
                                        {opt.label}
                                    </span>
                                    {filters.sort === opt.value && <Check size={14} strokeWidth={3} color="#313131" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="property-filters-container">
            {/* Single Row: Search + Filters + Rent Toggle */}
            <div className="filters-container-flex">
                {/* Market Selector for Map Page */}
                {filters.showMarketSelector && (
                    <div className="rent-type-tabs" style={{ marginRight: '1rem' }}>
                        <button
                            className={`rent-tab ${filters.market === 'new-building' ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, market: 'new-building' })}
                        >
                            {t('nav.newBuilding')}
                        </button>
                        <button
                            className={`rent-tab ${filters.market === 'secondary' ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, market: 'secondary' })}
                        >
                            {t('nav.secondary')}
                        </button>
                        <button
                            className={`rent-tab ${filters.market === 'rent' ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, market: 'rent' })}
                        >
                            {t('nav.rent')}
                        </button>
                    </div>
                )}

                {pageType === 'rent' && (
                    <div className="rent-type-tabs">
                        <button
                            className={`rent-tab ${filters.rentType === 'long' ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, rentType: 'long' })}
                        >
                            {t('filters.rentTerm.long')}
                        </button>
                        <button
                            className={`rent-tab ${filters.rentType === 'short' ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, rentType: 'short' })}
                        >
                            {t('filters.rentTerm.short')}
                        </button>
                    </div>
                )}
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('filters.searchPlaceholder')}
                        className="search-input"
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Mobile Filter Button */}
                <button
                    className="mobile-filter-btn"
                    onClick={() => setShowFiltersModal(true)}
                >
                    <SlidersHorizontal size={18} />
                    <span>{t('filters.more')}</span>
                </button>

                <div className="desktop-filters-wrapper" style={{ display: 'contents' }}>
                    {renderMultiSelect('type', t('filters.type'), localizedPropertyTypes)}

                    <LocationFilter
                        selectedAreas={filters.location}
                        onChange={(newAreas) => onFilterChange({ ...filters, location: newAreas })}
                        alignRight={true}
                    />

                    {renderMultiSelect('bedrooms', t('filters.bedrooms'), localizedBedroomOptions, true)}

                    {renderRangeFilter('price', t('filters.priceRange'), priceOptions, pageType === 'rent' ? '' : '', true)}

                    {renderRangeFilter('size', t('property.size'), sizeOptions, '', true)}

                    {renderMultiSelect('amenities', t('filters.amenities'), availableAmenities, true)}

                    <button
                        onClick={onClearFilters}
                        style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#333',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                        title={t('filters.clear')}
                        className="clear-filters-icon-btn"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile Filter Modal Portal */}
            {showFiltersModal && createPortal(
                <div className="filter-modal-overlay" onClick={() => setShowFiltersModal(false)}>
                    <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-modal-header">
                            <h3 className="filter-modal-title">{t('filters.more')}</h3>
                            <button className="close-modal-btn" onClick={() => setShowFiltersModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mobile Filters List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Market Selector for Mobile */}
                            {filters.showMarketSelector && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 600, color: '#333' }}>Market</label>
                                    <div className="rent-type-tabs" style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <button className={`rent-tab ${filters.market === 'new-building' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => onFilterChange({ ...filters, market: 'new-building' })}>{t('nav.newBuilding')}</button>
                                        <button className={`rent-tab ${filters.market === 'secondary' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => onFilterChange({ ...filters, market: 'secondary' })}>{t('nav.secondary')}</button>
                                        <button className={`rent-tab ${filters.market === 'rent' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => onFilterChange({ ...filters, market: 'rent' })}>{t('nav.rent')}</button>
                                    </div>
                                </div>
                            )}

                            {pageType === 'rent' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 600, color: '#333' }}>Term</label>
                                    <div className="rent-type-tabs" style={{ width: '100%' }}>
                                        <button className={`rent-tab ${filters.rentType === 'long' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => onFilterChange({ ...filters, rentType: 'long' })}>{t('filters.rentTerm.long')}</button>
                                        <button className={`rent-tab ${filters.rentType === 'short' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => onFilterChange({ ...filters, rentType: 'short' })}>{t('filters.rentTerm.short')}</button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('filters.type')}</label>
                                {renderMultiSelect('type', t('filters.type'), localizedPropertyTypes)}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('filters.location')}</label>
                                <LocationFilter
                                    selectedAreas={filters.location}
                                    onChange={(newAreas) => onFilterChange({ ...filters, location: newAreas })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('filters.bedrooms')}</label>
                                {renderMultiSelect('bedrooms', t('filters.bedrooms'), localizedBedroomOptions)}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('filters.priceRange')}</label>
                                {renderRangeFilter('price', t('filters.priceRange'), priceOptions, pageType === 'rent' ? '' : '')}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('property.size')}</label>
                                {renderRangeFilter('size', t('property.size'), sizeOptions, '')}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('filters.amenities')}</label>
                                {renderMultiSelect('amenities', t('filters.amenities'), availableAmenities)}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <button
                                onClick={() => setShowFiltersModal(false)}
                                style={{ width: '100%', padding: '1rem', background: 'black', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600 }}
                            >
                                {t('filters.showResults').replace('{count}', totalCount)}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Row 2: Count, Clear & Sort */}
            <div className="filters-bottom-row">
                <div className="results-count">
                    {totalCount !== undefined ? (
                        <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                            {t('filters.resultsFound').replace('{count}', totalCount)}
                        </span>
                    ) : null}
                </div>

                <div className="filters-actions-right">
                    <button className="clear-filters-btn" onClick={onClearFilters}>
                        {t('filters.clear')}
                    </button>
                    {/* Vertical Divider */}
                    <div className="filter-divider-vertical" />

                    {renderSortDropdown()}
                </div>
            </div>

            {/* Invisible Overlay to close dropdowns */}
            {
                openDropdown && (
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                        onClick={() => setOpenDropdown(null)}
                    />
                )
            }
        </div >
    );
}
