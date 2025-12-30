import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyGrid from '../components/listing/PropertyGrid';
import { getProperties } from '../api/client';
import useFavorites from '../hooks/useFavorites';
import { Share2, Heart, Copy, Check } from 'lucide-react';
import '../components/listing/ListingComponents.css';

import { useLanguage } from '../i18n/LanguageContext';

export default function LikedPage() {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const { favorites } = useFavorites();
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, new-building, secondary, rent
    const [isSharedView, setIsSharedView] = useState(false);
    const [copied, setCopied] = useState(false);

    // Determine which IDs to load: from URL (shared) or local storage (personal)
    const sharedIdsParam = searchParams.get('ids');

    useEffect(() => {
        const loadProperties = async () => {
            setIsLoading(true);
            const idsToFetch = sharedIdsParam ? sharedIdsParam.split(',') : favorites;

            setIsSharedView(!!sharedIdsParam);

            if (!idsToFetch || idsToFetch.length === 0) {
                setProperties([]);
                setIsLoading(false);
                return;
            }

            try {
                // Fetch all properties by IDs
                const response = await getProperties({
                    ids: idsToFetch.join(','),
                    limit: 9999
                });

                const data = response.data || [];
                setProperties(data);
            } catch (err) {
                console.error("Failed to load liked properties", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, [sharedIdsParam, favorites]);

    // Filter properties based on active tab
    const filteredProperties = useMemo(() => {
        if (activeTab === 'all') return properties;

        return properties.filter(p => {
            const market = (p.property_type || '').toLowerCase();
            const type = (p.type || '').toLowerCase();
            // Mapping logic consistent with PropertyCard/MapPage
            if (activeTab === 'new-building') {
                return market.includes('new building') || market.includes('off-plan') || type.includes('off-plan');
            }
            if (activeTab === 'rent') {
                return market.includes('rent') || type.includes('rent');
            }
            if (activeTab === 'secondary') {
                const isNew = market.includes('new building') || market.includes('off-plan') || type.includes('off-plan');
                const isRent = market.includes('rent') || type.includes('rent');
                return !isNew && !isRent;
            }
            return true;
        });
    }, [properties, activeTab]);

    const handleShare = async () => {
        const ids = favorites.join(',');
        const url = `${window.location.origin}/liked?ids=${ids}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="liked-page">
            <style>{`
                .liked-page-container {
                    margin-top: 120px;
                    margin-bottom: 4rem;
                }
                .liked-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .liked-title {
                    font-size: 2rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .liked-tabs-container {
                    background: #f4f4f4;
                    padding: 6px;
                    border-radius: 12px;
                    display: inline-flex;
                    gap: 4px;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }
                .liked-tab-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #666;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: capitalize;
                    white-space: nowrap;
                }
                .liked-tab-btn.active {
                    background: #fff;
                    color: #000;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                @media (max-width: 768px) {
                    .liked-page-container {
                        margin-top: 90px;
                        margin-bottom: 2rem;
                    }
                    .liked-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .liked-header > div {
                        width: 100%;
                    }
                    .share-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    .liked-title {
                        font-size: 1.75rem;
                    }
                    .liked-tabs-container {
                        width: 100%;
                        overflow-x: auto;
                        flex-wrap: nowrap;
                        display: flex;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none; /* Firefox */
                    }
                    .liked-tabs-container::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }
                    .liked-tab-btn {
                        flex-shrink: 0;
                        font-size: 14px;
                    }
                }
            `}</style>

            <div className="container liked-page-container">
                <div className="liked-header">
                    <div>
                        <h1 className="liked-title">
                            <Heart fill="#d20c0c" color="#d20c0c" />
                            {isSharedView ? t('pages.liked.titleShared') : t('pages.liked.titleMy')}
                        </h1>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            {t('pages.liked.savedCount').replace('{count}', properties.length)}
                        </p>
                    </div>

                    {!isSharedView && properties.length > 0 && (
                        <button
                            onClick={handleShare}
                            className="share-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#313131',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {copied ? <Check size={18} /> : <Share2 size={18} />}
                            {copied ? t('pages.liked.copied') : t('pages.liked.share')}
                        </button>
                    )}
                </div>

                {/* Tabs - Segmented Control Style */}
                {properties.length > 0 && (
                    <div className="liked-tabs-container">
                        {['all', 'new-building', 'secondary', 'rent'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`liked-tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab === 'all' ? t('filters.all') :
                                    tab === 'new-building' ? t('nav.newBuilding') :
                                        tab === 'secondary' ? t('nav.secondary') :
                                            t('nav.rent')}
                            </button>
                        ))}
                    </div>
                )}

                <div className="liked-grid">
                    <PropertyGrid
                        properties={filteredProperties}
                        loading={isLoading}
                        currentPage={1}
                        totalPages={1} // Single page for favorites usually
                    />
                </div>
            </div>
        </div>
    );
}
