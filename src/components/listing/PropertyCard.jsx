import React, { useState, useRef, useMemo } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFavorites from '../../hooks/useFavorites';
import { useLanguage } from '../../i18n/LanguageContext';

export default function PropertyCard({ property }) {
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { t } = useLanguage();
    const isLiked = isFavorite(property.id);
    const [scrollState, setScrollState] = useState({
        canScrollLeft: false,
        canScrollRight: true
    });
    const scrollContainerRef = useRef(null);

    // Normalize data from API or Mock
    const { title, location, price, size, type, currency } = useMemo(() => {
        const isNewBuilding = (property.property_type || '').includes('New Building');

        // Generate dynamic title for Secondary/Rent
        let displayTitle = property.development_name || property.title || 'Luxury Property';
        if (!isNewBuilding) {
            const bedText = property.beds > 0 ? `${property.beds} ${t('property.beds')} ` : '';
            const propType = property.type || property.property_type || 'Property';
            const locationText = [property.town, property.province].filter(Boolean).join(', ');
            displayTitle = `${bedText}${propType}${locationText ? ` ${t('common.in')} ${locationText}` : ''}`;
        }

        return {
            title: displayTitle,
            location: property.town || property.location || 'Spain',
            price: property.price,
            size: property.built_area || property.total_area || property.size || 'N/A',
            type: property.type || property.property_type || 'Property',
            currency: property.currency || '€'
        };
    }, [property, t]);

    // Handle images: API returns array of objects {image_url}, Mocks return array of strings or single string
    const images = useMemo(() => {
        let list = [];

        // Try property.images array first
        if (Array.isArray(property.images) && property.images.length > 0) {
            list = property.images.map(img => {
                if (typeof img === 'string') return img;
                if (img && typeof img === 'object') {
                    return img.image_url || img.url || img.path || Object.values(img).find(v => typeof v === 'string' && v.startsWith('http'));
                }
                return null;
            });
        }

        // Try single image field
        if (list.length === 0 && property.image) {
            list = [property.image];
        }

        // Final filter to ensure we only have valid URL strings
        return list.filter(url => url && typeof url === 'string' && url.trim().startsWith('http'));
    }, [property.images, property.image]);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setScrollState({
                canScrollLeft: scrollLeft > 0,
                canScrollRight: scrollLeft < scrollWidth - clientWidth - 5
            });
        }
    };

    React.useEffect(() => {
        checkScroll();
        if (images.length <= 1) return;

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (container) container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [images]);

    const formatPrice = (p) => {
        if (!p) return `${currency}0`;
        return typeof p === 'number'
            ? currency + ' ' + p.toLocaleString()
            : p;
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleCardClick = () => {
        // Market logic
        const type = (property.property_type || '').toLowerCase();
        let marketPath = 'new-building';

        if (type.includes('rent')) {
            marketPath = 'rent';
        } else if (type.includes('secondary')) {
            marketPath = 'secondary';
        }

        navigate(`/${marketPath}/${property.id}`);
    };

    return (
        <div className="listing-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="listing-image-wrapper">
                <div className="card-image-carousel" ref={scrollContainerRef}>
                    {images.map((img, index) => (
                        <div key={index} className="carousel-slide">
                            <img
                                src={img}
                                alt={`${title} - ${index + 1}`}
                                className="listing-card-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none'; // Hide broken images instead of showing placeholder
                                }}
                            />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className={`carousel-nav-btn prev ${!scrollState.canScrollLeft ? 'disabled' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (scrollState.canScrollLeft) scroll('left');
                            }}
                            disabled={!scrollState.canScrollLeft}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className={`carousel-nav-btn next ${!scrollState.canScrollRight ? 'disabled' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (scrollState.canScrollRight) scroll('right');
                            }}
                            disabled={!scrollState.canScrollRight}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                <button
                    className={`card-like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFavorite(property.id);
                    }}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="listing-card-content">
                <div className="listing-card-row header-row">
                    <h3 className="listing-card-title">{title}</h3>
                    <span className="listing-card-price">{formatPrice(price)}</span>
                </div>

                <div className="listing-card-row sub-header-row">
                    <span className="listing-card-location">{location}</span>
                </div>

                <div className="listing-card-divider" />

                <div className="listing-card-row footer-row">
                    <span className="listing-card-type">{type}</span>
                    <span className="listing-card-size">{t('property.size')}: {size} m²</span>
                </div>
            </div>
        </div>
    );
}
