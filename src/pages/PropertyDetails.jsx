import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import { Heart, MapPin, Bed, Bath, User, Calendar, Share2, Ruler, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getProperty, getPropertiesForMap } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A';
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

const ImageWithFallback = ({ src, alt, style }) => {
    const [error, setError] = useState(false);
    if (error || !src) return null;
    return <img src={src} alt={alt} style={style} onError={() => setError(true)} />;
};

export default function PropertyDetails() {
    const { t, language } = useLanguage();
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const similarScrollRef = useRef(null);

    const scrollSimilar = (direction) => {
        if (similarScrollRef.current) {
            const container = similarScrollRef.current;
            const scrollAmount = container.clientWidth;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Fetch Property Data
    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        getProperty(id)
            .then(data => {
                setProperty(data);
                setLoading(false);
                // Fetch similar properties
                getPropertiesForMap().then(all => {
                    const targetPrice = data.price;
                    const min = targetPrice * 0.95; // 5% range
                    const max = targetPrice * 1.05;

                    const similar = all.filter(p => {
                        if (p.id === data.id) return false;

                        // Price Check
                        if (p.price && (p.price < min || p.price > max)) return false;

                        // Market Check
                        if (data.property_type && p.market && p.market !== data.property_type) return false;

                        // Bedroom Check (allow +/- 1 bedroom or exact?)
                        const pBeds = p.bedrooms || p.beds;
                        const mainBeds = data.beds || data.bedrooms;
                        if (pBeds && mainBeds && Math.abs(pBeds - mainBeds) > 1) return false;

                        // Location Check
                        const pLoc = p.location?.name || '';
                        const mainLoc = data.town || '';
                        if (mainLoc && pLoc && !pLoc.includes(mainLoc) && !mainLoc.includes(pLoc)) return false;

                        return true;
                    }).slice(0, 10);
                    setSimilarProperties(similar);
                });
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('common.loading')}</div>;
    if (!property) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('common.noResults')}</div>;

    const formatter = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', { style: 'currency', currency: property.currency || 'EUR', maximumFractionDigits: 0 });
    const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit', fontSize: '14px' };

    const isMultipleImages = property.images && property.images.length > 1;

    // Aggressive filtering for gallery
    const galleryImages = (property.images || [])
        .map(img => {
            if (typeof img === 'string') return img;
            if (img && typeof img === 'object') return img.image_url || img.url || img.path;
            return null;
        })
        .filter(url => url && typeof url === 'string' && url.length > 10 && url.trim().startsWith('http'));

    // Remove duplicates and ensure unique list
    const finalImages = [...new Set(galleryImages)];

    // Group images into pages of 6 for the grid layout
    const chunkImages = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };
    const imagePages = chunkImages(finalImages, 6);
    const isSingleImage = finalImages.length === 1;

    const getBadgeText = () => {
        if (property.property_type === 'New Building') return t('property.badge.new');
        if (property.property_type === 'Rent') return t('property.badge.rent');
        return t('property.badge.secondary');
    };

    return (
        <div style={{ paddingBottom: '4rem', background: '#fff', paddingTop: '80px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Gallery Section */}
                <div style={{ position: 'relative', height: isSingleImage ? '500px' : '600px', marginBottom: '3rem', marginTop: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        height: '100%',
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none',
                        width: '100%',
                        borderRadius: '24px',
                        gap: '20px'
                    }} className="gallery-scroll">
                        <style>{`
                            .gallery-scroll::-webkit-scrollbar { display: none; }
                            .gallery-grid-page {
                                display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                grid-auto-rows: 290px;
                                gap: 10px;
                                flex: 0 0 100%;
                                min-width: 100%;
                                scroll-snap-align: start;
                            }
                            .single-image-layout {
                                width: 100%;
                                height: 100%;
                                flex: 0 0 100%;
                                scroll-snap-align: start;
                            }
                            @media (max-width: 768px) {
                                .gallery-grid-page {
                                    grid-template-columns: repeat(2, 1fr);
                                    grid-auto-rows: 200px;
                                }
                            }
                        `}</style>
                        {isSingleImage ? (
                            <div className="single-image-layout">
                                <ImageWithFallback
                                    src={finalImages[0]}
                                    alt="Property View"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                                />
                            </div>
                        ) : (
                            imagePages.map((page, pageIdx) => (
                                <div key={pageIdx} className="gallery-grid-page">
                                    {page.map((imgUrl, idx) => (
                                        <div key={idx} style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                                            <ImageWithFallback
                                                src={imgUrl}
                                                alt={`Property View ${pageIdx * 6 + idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    {finalImages.length > 6 && (
                        <>
                            <button
                                onClick={() => {
                                    const el = document.querySelector('.gallery-scroll');
                                    el.scrollBy({ left: -el.offsetWidth - 20, behavior: 'smooth' });
                                }}
                                style={{
                                    position: 'absolute', top: '50%', left: '-22px', transform: 'translateY(-50%)',
                                    background: 'white', border: '1px solid #eee', borderRadius: '50%', width: '44px', height: '44px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    zIndex: 10
                                }}
                            >
                                <ChevronLeft size={24} color="#333" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.querySelector('.gallery-scroll');
                                    el.scrollBy({ left: el.offsetWidth + 20, behavior: 'smooth' });
                                }}
                                style={{
                                    position: 'absolute', top: '50%', right: '-22px', transform: 'translateY(-50%)',
                                    background: 'white', border: '1px solid #eee', borderRadius: '50%', width: '44px', height: '44px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    zIndex: 10
                                }}
                            >
                                <ChevronRight size={24} color="#333" />
                            </button>
                        </>
                    )}

                    {/* Gallery Overlay Buttons (Share/Like) */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 10 }}>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            style={{
                                background: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Heart size={20} fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "#333"} />
                        </button>
                    </div>
                </div>

                <div className="property-main-content">
                    {/* LEFT COLUMN: Info & Map */}
                    <div className="property-info-column">
                        {/* Header */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div className="property-header-row">
                                <div>
                                    <span style={{
                                        fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                                        color: '#888', background: '#f5f5f5', padding: '6px 12px', borderRadius: '4px'
                                    }}>
                                        {getBadgeText()}
                                    </span>
                                    <h1 className="property-title">
                                        {(() => {
                                            const isNewBuilding = (property.property_type || '').toLowerCase().includes('new building');
                                            // Prefer localized title if available
                                            const localizedTitle = property['title_' + language] || property.title_en || property.title;

                                            if (isNewBuilding) return property.development_name || localizedTitle || `Property ${property.reference_id}`;

                                            const bedText = property.beds > 0 ? `${property.beds} ${t('property.beds')} ` : '';
                                            const propType = property.type || property.property_type || 'Property';
                                            const locationText = [property.town, property.province].filter(Boolean).join(', ');
                                            return localizedTitle || `${bedText}${propType}${locationText ? ` ${t('common.in')} ${locationText}` : ''}`;
                                        })()}
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="add-to-fav-btn"
                                >
                                    <Heart size={18} fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "#333"} />
                                    <span>{isLiked ? t('property.form.interested') : t('common.addToFav')}</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                                <MapPin size={16} />
                                {property.town}, {property.province}
                            </div>
                            <div style={{ marginTop: '1.5rem', fontSize: '28px', fontWeight: 700, color: '#1a1a1a' }}>
                                {formatter.format(property.price)}
                                {property.market === 'rent' && <span style={{ fontSize: '16px', fontWeight: 400, color: '#666' }}>{t('property.month')}</span>}
                            </div>
                        </div>

                        {/* Specs */}
                        <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bed size={20} color="#666" /> <span><b>{property.beds}</b> {t('property.beds')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bath size={20} color="#666" /> <span><b>{property.baths}</b> {t('property.baths')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Ruler size={20} color="#666" /> <span><b>{property.built_area}</b> m²</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>{t('property.description')}</h3>
                            <p style={{ lineHeight: '1.6', color: '#444' }}>
                                {property['description_' + language] || property.description_en || property.description}
                            </p>

                            {property.amenities && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.5rem' }}>
                                    {property.amenities.map((am, idx) => (
                                        <span key={`${am}-${idx}`} style={{ background: '#f9f9f9', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#555', border: '1px solid #eee' }}>
                                            {am}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Map
                                initialViewState={{
                                    longitude: property.longitude || -4.9,
                                    latitude: property.latitude || 36.5,
                                    zoom: 14
                                }}
                                style={{ width: '100%', height: '100%' }}
                                mapStyle={MAP_STYLE}
                                mapboxAccessToken={MAPBOX_TOKEN}
                                attributionControl={false}
                            >
                                <Marker longitude={property.longitude || -4.9} latitude={property.latitude || 36.5} color="black" />
                            </Map>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Contact */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{ position: 'sticky', top: '2rem', background: '#fbfbfb', padding: '2rem', borderRadius: '16px', border: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '0.5rem' }}>{t('property.form.interested')}</h3>
                            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '14px' }}>{t('property.form.subtitle')}</p>

                            <form onSubmit={e => e.preventDefault()}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <input type="text" placeholder={t('property.form.name')} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <input type="tel" placeholder={t('property.form.phone')} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <input type="email" placeholder={t('property.form.email')} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <textarea
                                        rows="4"
                                        placeholder={t('property.form.message')}
                                        defaultValue={t('property.form.defaultMessage').replace('{property}', property.development_name || property.reference_id)}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                    ></textarea>
                                </div>
                                <button style={{ width: '100%', padding: '14px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    {t('property.form.send')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SIMILAR PROJECTS */}
                {similarProperties.length > 0 && (
                    <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>{t('property.similar')}</h2>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    onClick={() => scrollSimilar('left')}
                                    style={{
                                        background: 'white', border: '1px solid #eee', borderRadius: '50%', width: '40px', height: '40px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <ChevronLeft size={20} color="#333" />
                                </button>
                                <button
                                    onClick={() => scrollSimilar('right')}
                                    style={{
                                        background: 'white', border: '1px solid #eee', borderRadius: '50%', width: '40px', height: '40px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <ChevronRight size={20} color="#333" />
                                </button>
                            </div>
                        </div>

                        <div className="similar-scroll" ref={similarScrollRef} style={{
                            display: 'flex',
                            gap: '1.5rem',
                            overflowX: 'auto',
                            paddingBottom: '1rem',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none'
                        }}>
                            <style>{`.similar-scroll::-webkit-scrollbar { display: none; }`}</style>
                            {similarProperties.map(sim => {
                                const simType = (sim.property_type || '').toLowerCase();
                                let marketPath = 'new-building';
                                if (simType.includes('rent')) marketPath = 'rent';
                                else if (simType.includes('secondary')) marketPath = 'secondary';

                                let simTitle = sim.development_name || sim.title || 'Luxury Property';
                                if (!simType.includes('new building')) {
                                    const bedText = sim.beds > 0 || sim.bedrooms > 0 ? `${sim.beds || sim.bedrooms} ${t('property.beds')} ` : '';
                                    const propType = sim.type || sim.property_type || 'Property';
                                    simTitle = `${bedText}${propType}`;
                                }
                                const simImg = (sim.images && sim.images[0]?.image_url) || (sim.images && sim.images[0]) || sim.image || 'https://via.placeholder.com/280x200';

                                return (
                                    <a
                                        href={`/${marketPath}/${sim.id}`}
                                        key={sim.id}
                                        style={{
                                            flex: '0 0 280px',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            scrollSnapAlign: 'start'
                                        }}
                                    >
                                        <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: '#eee' }}>
                                            <img
                                                src={simImg}
                                                alt={simTitle}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {simTitle}
                                        </h4>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                                            {sim.town || sim.location?.name}
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 700 }}>
                                            {formatter.format(sim.price)}
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
