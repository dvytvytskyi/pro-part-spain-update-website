import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Estepona() {
    const { t } = useLanguage();

    return (
        <div className="marbella-page">
            <div className="marbella-container">
                {/* Header */}
                <div className="marbella-header">
                    <div className="header-left">
                        <Link to="/areas" className="back-link-dark">
                            <ArrowLeft size={20} /> Back to Areas
                        </Link>
                        <h1 className="marbella-title">Estepona</h1>
                        <p className="marbella-subtitle">The Garden of the Costa del Sol</p>
                    </div>
                    <div className="header-stats">
                        <div className="mini-stat">
                            <Sun size={18} />
                            <span>320+ Sunny Days</span>
                        </div>
                        <div className="mini-stat">
                            <Umbrella size={18} />
                            <span>27km Coastline</span>
                        </div>
                        <div className="mini-stat">
                            <Star size={18} />
                            <span>5* Lifestyle</span>
                        </div>
                    </div>
                </div>

                {/* Hero Images */}
                <div className="marbella-hero-grid">
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767186748/areas/estepona-1.jpg"
                            alt="Estepona Coastline"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767187376/areas/estepona-3.jpg"
                            alt="Estepona Lifestyle"
                            className="marbella-hero-image"
                        />
                    </div>
                </div>
            </div>

            {/* Intro Stats */}
            <section className="marbella-stats-section">
                <div className="marbella-container">
                    <div className="marbella-intro">
                        <h2>Where Luxury Meets Lifestyle</h2>
                        <div className="intro-text">
                            <p>
                                Estepona has blossomed into one of the most desirable locations on the Costa del Sol, affectionately known as "The Garden of the Costa del Sol." It successfully marries a traditional Andalusian fishing village charm with modern luxury developments. Its meticulously focused urban renewal has created a pedestrian-friendly center filled with colorful flower pots and vibrant murals.
                            </p>
                            <p>
                                The New Golden Mile, stretching east towards Marbella, is home to some of the coast's finest luxury hotels and exclusive beachfront properties. Residents enjoy a relaxed pace of life with access to championship golf courses, a busy marina, and 21 kilometers of coastline boasting Blue Flag beaches.
                            </p>
                            <p>
                                With excellent amenities, international schools, and a thriving gastronomic scene, Estepona offers the perfect balance of authenticity and modern convenience. Whether it's a townhouse in the floral historic center or a contemporary villa on the New Golden Mile, Estepona guarantees a high quality of life.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Estepona's Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>New Golden Mile</h3>
                            <p>Exclusive beachfront luxury.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>Estepona Port</h3>
                            <p>Marina vibe & sunday markets.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Old Town</h3>
                            <p>Andalusian charm & flower streets.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>Cancelada</h3>
                            <p>Village feel with modern growth.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>Seghers</h3>
                            <p>Green oasis near the port.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Valle Romano</h3>
                            <p>Golf living & mountain views.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
