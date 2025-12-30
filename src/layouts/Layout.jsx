import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Phone, Heart, ChevronDown, Menu, X } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import Footer from '../components/Footer';
import './Layout.css';

export default function Layout() {
    const { language, setLanguage, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isMap = location.pathname === '/map';

    useEffect(() => {
        // Only scroll to top on path change if it's not a back/forward (Pop) navigation
        // Or we can just remove it and let pages decide. 
        // For general UX, we usually WANT to scroll to top when clicking a new link.
        // But the browser's native restoration is often better if we don't force it.
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'en', name: 'EN' },
        { code: 'es', name: 'ES' },
        { code: 'ru', name: 'RU' }
    ];

    const { favorites } = useFavorites();

    return (
        <div className="app-layout">
            <header className={`app-header ${scrolled || !isHome || menuOpen ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
                <div className="header-left">
                    <Link to="/" className="logo-link">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1766757920/spain-real-estate/logo.svg"
                            alt="Spain Real Estate"
                            className="logo-img"
                        />
                    </Link>
                </div>

                <div className="header-center">
                    <nav className="app-nav">
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                            {t('nav.home')}
                        </Link>
                        <Link to="/new-building" className={location.pathname === '/new-building' ? 'active' : ''}>
                            {t('nav.newBuilding')}
                        </Link>
                        <Link to="/secondary" className={location.pathname === '/secondary' ? 'active' : ''}>
                            {t('nav.secondary')}
                        </Link>
                        <Link to="/rent" className={location.pathname === '/rent' ? 'active' : ''}>
                            {t('nav.rent')}
                        </Link>
                        <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
                            {t('nav.map')}
                        </Link>
                        <Link to="/areas" className={location.pathname === '/areas' ? 'active' : ''}>
                            {t('nav.areas')}
                        </Link>
                        <Link to="/news" className={location.pathname === '/news' ? 'active' : ''}>
                            {t('nav.news')}
                        </Link>
                    </nav>
                </div>

                <div className="header-right">
                    <Link to="/liked" className="icon-btn liked-btn" aria-label="Liked" style={{ position: 'relative' }}>
                        <Heart size={20} />
                        {favorites.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#D20C0C',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {favorites.length}
                            </span>
                        )}
                    </Link>

                    <Link to="/contact" className="contact-btn" aria-label="Contact Us">
                        <Phone size={18} />
                    </Link>

                    <div className="language-selector">
                        <button
                            className="language-btn"
                            onClick={() => setLanguageOpen(!languageOpen)}
                        >
                            {language.toUpperCase()}
                            <ChevronDown size={14} />
                        </button>

                        {languageOpen && (
                            <div className="language-dropdown">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={language === lang.code ? 'active' : ''}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLanguageOpen(false);
                                        }}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="icon-btn burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
                    <Link to="/new-building" onClick={() => setMenuOpen(false)}>{t('nav.newBuilding')}</Link>
                    <Link to="/secondary" onClick={() => setMenuOpen(false)}>{t('nav.secondary')}</Link>
                    <Link to="/rent" onClick={() => setMenuOpen(false)}>{t('nav.rent')}</Link>
                    <Link to="/map" onClick={() => setMenuOpen(false)}>{t('nav.map')}</Link>
                    <Link to="/areas" onClick={() => setMenuOpen(false)}>{t('nav.areas')}</Link>
                    <Link to="/news" onClick={() => setMenuOpen(false)}>{t('nav.news')}</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
                </nav>

                <div className="mobile-languages">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`mobile-lang-btn ${language === lang.code ? 'active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                        >
                            {lang.code.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <main className="app-content">
                <Outlet />
            </main>

            {!isMap && <Footer />}
        </div>
    );
}
