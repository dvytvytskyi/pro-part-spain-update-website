import { useState, useRef, useEffect } from 'react';
import { Search, Map as MapIcon, ChevronDown, ArrowUpRight, ArrowLeft, ArrowRight, Scale, CreditCard, Bell, Shield } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import CatalogModal from '../components/CatalogModal';
import { getNews, getProperties } from '../api/client';
import { staticLocations } from '../data/staticLocations';
import './Home.css';

export default function Home() {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize from URL
    const [activeTab, setActiveTab] = useState(searchParams.get('market') || 'new-building');
    const [selectedAreas, setSelectedAreas] = useState(() => {
        const loc = searchParams.get('location');
        return loc ? loc.split(',') : [];
    });

    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const scrollContainerRef = useRef(null);
    const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [news, setNews] = useState([]);

    // Update URL when selection changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set('market', activeTab);
        if (selectedAreas.length > 0) {
            params.set('location', selectedAreas.join(','));
        } else {
            params.delete('location');
        }
        setSearchParams(params, { replace: true });
    }, [activeTab, selectedAreas]);

    const handleSearch = () => {
        const path = activeTab === 'new-building' ? '/new-building' : activeTab === 'secondary' ? '/secondary' : '/rent';
        navigate(`${path}?${searchParams.toString()}`);
    };

    // Fetch featured properties and news
    useEffect(() => {
        const fetchData = async () => {
            const propertiesData = await getProperties({
                limit: 6,
                type: 'New Building',
                featured: true
            });
            setFeaturedProperties(propertiesData.data || []);

            const newsData = await getNews();
            setNews(newsData || []);
        };
        fetchData();
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Approximates card width + gap
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const areaGroups = Object.entries(staticLocations).map(([town, areas]) => ({
        name: town,
        areas: [town, ...[...areas].sort((a, b) => a.localeCompare(b))]
    })).sort((a, b) => a.name.localeCompare(b.name));

    const toggleArea = (area) => {
        if (selectedAreas.includes(area)) {
            setSelectedAreas(selectedAreas.filter(a => a !== area));
        } else {
            setSelectedAreas([...selectedAreas, area]);
        }
    };

    const toggleGroup = (groupName) => {
        if (expandedGroups.includes(groupName)) {
            setExpandedGroups(expandedGroups.filter(g => g !== groupName));
        } else {
            setExpandedGroups([...expandedGroups, groupName]);
        }
    };

    const getGroupCount = (groupName) => {
        const group = areaGroups.find(g => g.name === groupName);
        if (!group) return 0;
        return group.areas.filter(area => selectedAreas.includes(area)).length;
    };

    return (
        <>
            <div className="hero-section">
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1>{t('hero.title')}</h1>
                    <p>{t('hero.subtitle')}</p>

                    <div className="hero-search-container">
                        <div className="search-dropdown-wrapper">
                            <div
                                className={`search-dropdown ${isAreaDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                            >
                                <span>
                                    {selectedAreas.length > 0
                                        ? t('search.selected').replace('{count}', selectedAreas.length)
                                        : t('search.placeholder')}
                                </span>
                                <ChevronDown size={20} className={`dropdown-icon ${isAreaDropdownOpen ? 'rotate' : ''}`} />
                            </div>

                            {isAreaDropdownOpen && (
                                <div className="area-dropdown-menu">
                                    {areaGroups.map((group) => (
                                        <div key={group.name} className={`area-group ${expandedGroups.includes(group.name) ? 'expanded' : ''}`}>
                                            <div
                                                className="area-group-header"
                                                onClick={() => toggleGroup(group.name)}
                                            >
                                                <div className="group-info">
                                                    {getGroupCount(group.name) > 0 && (
                                                        <span className="area-count-badge">{getGroupCount(group.name)}</span>
                                                    )}
                                                    <span className="area-group-title">{group.name}</span>
                                                </div>
                                                <ChevronDown size={16} className={`group-arrow ${expandedGroups.includes(group.name) ? 'rotate' : ''}`} />
                                            </div>
                                            {expandedGroups.includes(group.name) && (
                                                <div className="area-list">
                                                    {group.areas.map((area) => (
                                                        <label key={area} className="area-item">
                                                            <span className="area-name">{area}</span>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAreas.includes(area)}
                                                                onChange={() => toggleArea(area)}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="search-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'new-building' ? 'active' : ''}`}
                                onClick={() => setActiveTab('new-building')}
                            >
                                {t('search.tabs.new')}
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'secondary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('secondary')}
                            >
                                {t('search.tabs.secondary')}
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'rent' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rent')}
                            >
                                {t('search.tabs.rent')}
                            </button>
                        </div>

                        <div className="hero-actions">
                            <button
                                className="search-btn"
                                aria-label={t('filters.search')}
                                onClick={handleSearch}
                            >
                                <Search size={22} />
                            </button>

                            <Link
                                to={`/map?${searchParams.toString()}`}
                                className="map-btn-hero"
                                aria-label={t('nav.map')}
                            >
                                <MapIcon size={22} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <section className="about-section">
                <div className="about-container">
                    <div className="about-header">
                        <h2>{t('about.title')}</h2>
                        <div className="rating-badge">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className="star">★</span>
                                ))}
                            </div>
                            <span className="rating-text">4.97/5</span>
                        </div>
                    </div>

                    <p className="about-description">
                        {t('about.description')}
                    </p>

                    <div className="about-stats">
                        <div className="stat-item">
                            <h3>98%</h3>
                            <p>{t('about.stats.satisfaction')}</p>
                        </div>
                        <div className="stat-item">
                            <h3>15+</h3>
                            <p>{t('about.stats.years')}</p>
                        </div>
                        <div className="stat-item">
                            <h3>€500m+</h3>
                            <p>{t('about.stats.value')}</p>
                        </div>
                        <div className="stat-item">
                            <h3>5k+</h3>
                            <p>{t('about.stats.clients')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="featured-container">
                    <div className="featured-header">
                        <h2 style={{ whiteSpace: 'pre-line' }}>{t('featured.title')}</h2>
                        <p className="featured-description">
                            {t('featured.description')}
                        </p>
                    </div>

                    <div className="properties-grid" ref={scrollContainerRef}>
                        {featuredProperties.map((property) => (
                            <div key={property.id} className="property-card" onClick={() => navigate(`/${property.property_type.toLowerCase()}/${property.id}`)}>
                                <img
                                    src={property.images?.[0]?.image_url || property.image}
                                    alt={property.development_name}
                                    className="property-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none'; // Hide if missing
                                    }}
                                />
                                <div className="property-content">
                                    <h3 className="property-title">{property.development_name}, {property.built_area || property.total_area}m²</h3>
                                    <p className="property-price">{t('common.from')} {property.currency} {property.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="featured-footer">
                        <button className="catalog-btn" onClick={() => setIsCatalogModalOpen(true)} style={{ border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                            {t('featured.openCatalog')} <ArrowUpRight size={16} style={{ marginLeft: '8px' }} />
                        </button>

                        <div className="nav-buttons">
                            <button className="nav-btn prev" aria-label="Previous" onClick={() => scroll('left')}>
                                <ArrowLeft size={18} />
                            </button>
                            <button className="nav-btn next" aria-label="Next" onClick={() => scroll('right')}>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="experience-section">
                <div className="experience-container">
                    <div className="experience-content">
                        <span className="experience-label">{t('experience.label')}</span>
                        <h2 className="experience-headline">
                            {t('experience.title')}
                        </h2>
                    </div>

                    <div className="experience-grid">
                        <div className="stat-card">
                            <span className="stat-label" style={{ whiteSpace: 'pre-line' }}>{t('experience.stats.satisfaction')}</span>
                            <span className="stat-value">98%</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label" style={{ whiteSpace: 'pre-line' }}>{t('experience.stats.years')}</span>
                            <span className="stat-value">15+</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label" style={{ whiteSpace: 'pre-line' }}>{t('experience.stats.value')}</span>
                            <span className="stat-value">€500m+</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label" style={{ whiteSpace: 'pre-line' }}>{t('experience.stats.clients')}</span>
                            <span className="stat-value">5k+</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="services-section">
                <div className="services-container">
                    <div className="services-top">
                        <div className="services-intro">
                            <span className="services-intro-label">{t('services.intro')}</span>
                            <h2 className="services-title" style={{ whiteSpace: 'pre-line' }}>
                                {t('services.title')}
                            </h2>
                        </div>
                        <div className="services-list">
                            <div className="service-list-item">
                                <span>{t('services.items.1')}</span>
                                <span className="num">01</span>
                            </div>
                            <div className="service-list-item">
                                <span>{t('services.items.2')}</span>
                                <span className="num">02</span>
                            </div>
                            <div className="service-list-item">
                                <span>{t('services.items.3')}</span>
                                <span className="num">03</span>
                            </div>
                            <div className="service-list-item">
                                <span>{t('services.items.4')}</span>
                                <span className="num">04</span>
                            </div>
                        </div>
                    </div>

                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon-wrapper"><Scale size={24} /></div>
                            <div>
                                <h4>{t('services.cards.legal.title')}</h4>
                                <p>{t('services.cards.legal.desc')}</p>
                            </div>
                        </div>
                        <div className="service-card">
                            <div className="service-icon-wrapper"><CreditCard size={24} /></div>
                            <div>
                                <h4>{t('services.cards.goldenVisa.title')}</h4>
                                <p>{t('services.cards.goldenVisa.desc')}</p>
                            </div>
                        </div>
                        <div className="service-card">
                            <div className="service-icon-wrapper"><Bell size={24} /></div>
                            <div>
                                <h4>{t('services.cards.concierge.title')}</h4>
                                <p>{t('services.cards.concierge.desc')}</p>
                            </div>
                        </div>
                        <div className="service-card">
                            <div className="service-icon-wrapper"><Shield size={24} /></div>
                            <div>
                                <h4>{t('services.cards.insurance.title')}</h4>
                                <p>{t('services.cards.insurance.desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="areas-section">
                <div className="areas-header">
                    <h2>{t('areas.title')}</h2>
                </div>
                <div className="areas-grid">
                    <div className="area-card span-2">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087830/areas/marbella.jpg" alt="Marbella" />
                        <div className="area-overlay">
                            <span className="area-name">Marbella</span>
                            <span className="area-location"><MapIcon size={14} /> Golden Mile</span>
                        </div>
                    </div>
                    <div className="area-card tall">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087832/areas/benahavis.jpg" alt="Benahavís" />
                        <div className="area-overlay">
                            <span className="area-name">Benahavís</span>
                            <span className="area-location"><MapIcon size={14} /> La Zagaleta</span>
                        </div>
                    </div>
                    <div className="area-card span-2">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087834/areas/sotogrande.jpg" alt="Sotogrande" />
                        <div className="area-overlay">
                            <span className="area-name">Sotogrande</span>
                            <span className="area-location"><MapIcon size={14} /> Marina</span>
                        </div>
                    </div>
                    <div className="area-card">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087831/areas/estepona.jpg" alt="Estepona" />
                        <div className="area-overlay">
                            <span className="area-name">Estepona</span>
                            <span className="area-location"><MapIcon size={14} /> New Golden Mile</span>
                        </div>
                    </div>
                    <div className="area-card">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087956/areas/mijas.png" alt="Mijas" />
                        <div className="area-overlay">
                            <span className="area-name">Mijas</span>
                            <span className="area-location"><MapIcon size={14} /> Mijas Pueblo</span>
                        </div>
                    </div>
                    <div className="area-card span-2">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087834/areas/casares.webp" alt="Casares" />
                        <div className="area-overlay">
                            <span className="area-name">Casares</span>
                            <span className="area-location"><MapIcon size={14} /> Finca Cortesin</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="news-section">
                <div className="news-header">
                    <h2>{t('news.title')}</h2>
                    <Link to="/news" className="view-all-btn">{t('news.viewAll')} <ArrowRight size={18} /></Link>
                </div>
                <div className="news-grid">
                    {news.slice(0, 3).map((item) => (
                        <div
                            key={item.id}
                            className="news-card"
                            onClick={() => navigate(`/news/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="news-image-wrapper">
                                <img
                                    src={item.featured_image_url || item.image_url || '/placeholder.jpg'}
                                    alt={item['title_' + language] || item.title_en}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <span className="news-date">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <h3 className="news-title">{item['title_' + language] || item.title_en}</h3>
                            <p className="news-excerpt">
                                {item['description_' + language] || item.description_en}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <CatalogModal isOpen={isCatalogModalOpen} onClose={() => setIsCatalogModalOpen(false)} />
        </>
    );
}
