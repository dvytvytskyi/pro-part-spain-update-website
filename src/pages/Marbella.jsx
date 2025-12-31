import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Marbella() {
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
                        <h1 className="marbella-title">Marbella</h1>
                        <p className="marbella-subtitle">The Crown Jewel of Costa del Sol</p>
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
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767186110/areas/marbella-interior.jpg"
                            alt="Marbella Interior"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767185996/areas/marbella-villa.jpg"
                            alt="Marbella Villa Lifestyle"
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
                                Marbella is widely recognized as one of Europe's most prestigious residential destinations, offering a lifestyle that seamlessly blends sophisticated luxury with relaxed Mediterranean charm. Renowned for its iconic Golden Mile and the world-famous Puerto Banús marina, the city attracts a cosmopolitan community that values exclusivity, privacy, and an exceptional quality of life.
                            </p>
                            <p>
                                Beyond its glamour, Marbella boasts an enviable microclimate protected by the Sierra Blanca mountains, delivering over 320 sunny days a year. This unique weather allows for year-round outdoor living, from championship golf courses and tennis clubs to pristine beaches and mountain trails, making it a true paradise for sports and wellness enthusiasts.
                            </p>
                            <p>
                                The area is also home to excellent infrastructure, including top-tier international schools, state-of-the-art medical facilities, and a vibrant culinary scene that ranges from traditional tapas bars to Michelin-starred dining. Whether seeking a secluded villa in the hills or a contemporary penthouse by the sea, Marbella offers the pinnacle of modern Mediterranean living.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Marbella's Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>Golden Mile</h3>
                            <p>The most exclusive 5-star address.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>Puerto Banús</h3>
                            <p>Luxury marina, shopping & nightlife.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Sierra Blanca</h3>
                            <p>Private villas with panoramic views.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>Nueva Andalucía</h3>
                            <p>The Golf Valley & family living.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>Los Monteros</h3>
                            <p>Beachside luxury on the East side.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Guadalmina</h3>
                            <p>Elegant beachside estate & golf.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
