import React from 'react';
import { Play, ArrowUpRight, Sun, MapPin, ArrowRight } from 'lucide-react';
import './Areas.css';
import { useLanguage } from '../i18n/LanguageContext';

export default function Areas() {
    const { t } = useLanguage();

    const areas = [
        { id: 1, name: 'Marbella', count: 145, image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80', span: 'span-2' },
        { id: 2, name: 'Benahavís', count: 89, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80', tall: true },
        { id: 3, name: 'Sotogrande', count: 64, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', span: 'span-2' },
        { id: 4, name: 'Estepona', count: 92, image: 'https://images.unsplash.com/photo-1558238283-da6f22d64111?auto=format&fit=crop&q=80' },
        { id: 5, name: 'Mijas', count: 53, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80' },
        { id: 6, name: 'Casares', count: 47, image: 'https://images.unsplash.com/photo-1542318424-d4b6c3741893?auto=format&fit=crop&q=80', span: 'span-2' }
    ];

    return (
        <div className="areas-page">
            <div className="areas-container">
                {/* Hero / Bento */}
                <section className="areas-hero">
                    <div className="areas-header">
                        <h1 className="areas-title" style={{ whiteSpace: 'pre-line' }}>
                            {t('pages.areasPage.title')}
                        </h1>

                        <div className="areas-header-info">
                            <p className="header-desc" style={{ whiteSpace: 'pre-line' }}>
                                {t('pages.areasPage.subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-left">
                            <div className="video-card">
                                <img src="https://images.unsplash.com/photo-1512918760513-e7ded8a65f97?auto=format&fit=crop&q=80" alt="Coastline Video" />
                                <div className="play-btn">
                                    <Play fill="white" size={24} style={{ marginLeft: '4px' }} />
                                </div>
                            </div>
                            <div className="bento-bottom-row">
                                <div className="bento-card card-dark">
                                    <div>
                                        <div className="card-icon">
                                            <MapPin size={24} />
                                        </div>
                                        <h3 className="card-title">{t('pages.areasPage.premiumTitle')}</h3>
                                        <p className="card-subtitle">{t('pages.areasPage.premiumDesc')}</p>
                                    </div>
                                    <div className="card-arrow">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                                <div className="bento-card card-light">
                                    <div>
                                        <div className="card-icon">
                                            <Sun size={24} />
                                        </div>
                                        <h3 className="card-title">320+</h3>
                                        <p className="card-subtitle">{t('pages.areasPage.days')}</p>
                                    </div>
                                    <div className="card-arrow">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bento-right">
                            <img src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80" alt="Lifestyle" className="right-img" />
                            <a href="#explore" className="learn-more-btn">
                                {t('pages.areasPage.explore')} <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Areas List */}
                <section className="areas-list-section" id="explore">
                    <h2 className="areas-list-title">{t('pages.areasPage.exploreRegions')}</h2>
                    <div className="areas-grid-list">
                        {areas.map(area => (
                            <div key={area.id} className={`area-list-card ${area.span || ''} ${area.tall ? 'tall' : ''}`}>
                                <img src={area.image} alt={area.name} />
                                <div className="area-list-overlay">
                                    <h3 className="area-list-title">{area.name}</h3>
                                    <span className="area-list-count">{t('pages.areasPage.propertiesCount').replace('{count}', area.count)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
