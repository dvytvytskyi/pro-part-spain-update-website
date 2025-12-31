import React, { useState } from 'react';
import { Play, ArrowUpRight, Sun, MapPin, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Areas.css';
import { useLanguage } from '../i18n/LanguageContext';

export default function Areas() {
    const { t } = useLanguage();
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

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
                <section className="areas-new-hero">
                    <div className="new-hero-top">
                        <h1 className="new-hero-title">
                            {t('pages.areasPage.title')}
                        </h1>
                        <div className="new-hero-info">
                            <p className="new-hero-desc">
                                {t('pages.areasPage.subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="new-hero-stats">
                        <div className="new-stat-card">
                            <span className="new-stat-number">320+</span>
                            <p className="new-stat-text">{t('pages.areasPage.days')}</p>
                        </div>
                        <div className="new-stat-card">
                            <span className="new-stat-number">25°C</span>
                            <p className="new-stat-text">{t('pages.areasPage.temp') || "Average Annual Temperature"}</p>
                        </div>
                        <div className="new-stat-card">
                            <span className="new-stat-number">100+</span>
                            <p className="new-stat-text">{t('pages.areasPage.beaches') || "Blue Flag Beaches"}</p>
                        </div>
                    </div>
                </section>

                {/* Areas List */}
                <section className="areas-list-section" id="explore">
                    <h2 className="areas-list-title">{t('pages.areasPage.exploreRegions')}</h2>
                    <div className="areas-grid-list">
                        <Link to="/areas/marbella" className="area-list-card span-2">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087830/areas/marbella.jpg" alt="Marbella" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Marbella</span>
                                <span className="area-list-count"><MapPin size={14} /> Golden Mile</span>
                            </div>
                        </Link>
                        <Link to="/areas/benahavis" className="area-list-card tall">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087832/areas/benahavis.jpg" alt="Benahavís" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Benahavís</span>
                                <span className="area-list-count"><MapPin size={14} /> La Zagaleta</span>
                            </div>
                        </Link>
                        <Link to="/areas/sotogrande" className="area-list-card span-2">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087834/areas/sotogrande.jpg" alt="Sotogrande" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Sotogrande</span>
                                <span className="area-list-count"><MapPin size={14} /> Marina</span>
                            </div>
                        </Link>
                        <Link to="/areas/estepona" className="area-list-card">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087831/areas/estepona.jpg" alt="Estepona" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Estepona</span>
                                <span className="area-list-count"><MapPin size={14} /> New Golden Mile</span>
                            </div>
                        </Link>
                        <Link to="/areas/mijas" className="area-list-card">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087956/areas/mijas.png" alt="Mijas" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Mijas</span>
                                <span className="area-list-count"><MapPin size={14} /> Mijas Pueblo</span>
                            </div>
                        </Link>
                        <Link to="/areas/casares" className="area-list-card span-2">
                            <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767087834/areas/casares.webp" alt="Casares" />
                            <div className="area-list-overlay">
                                <span className="area-list-title">Casares</span>
                                <span className="area-list-count"><MapPin size={14} /> Finca Cortesin</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="areas-faq-section">
                    <h2 className="faq-title">{t('pages.areasPage.faq.title')}</h2>
                    <div className="faq-container">
                        {(t('pages.areasPage.faq.items', { returnObjects: true }) || []).map((item, index) => (
                            <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                                <div className="faq-question">
                                    <h3>{item.question}</h3>
                                    {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
