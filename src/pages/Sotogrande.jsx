import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Sotogrande() {
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
                        <h1 className="marbella-title">Sotogrande</h1>
                        <p className="marbella-subtitle">Polo, Golf & Elite Yachting</p>
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
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767187276/areas/sotogrande-3.jpg"
                            alt="Sotogrande Marina"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767187278/areas/sotogrande-4.jpg"
                            alt="Sotogrande Lifestyle"
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
                                Sotogrande is one of the most prestigious privately owned residential developments in Andalucía. Known for its understated luxury, it is a world-renowned destination for polo, golf, and yachting enthusiasts. The resort covers 20 square kilometers of beautifully landscaped residential areas, stretching from the Mediterranean Sea into the foothills of the Sierra Almenara.
                            </p>
                            <p>
                                It is home to the famous Santa María Polo Club and some of Europe's top golf courses, including Valderrama, hosting major international tournaments. The marina is the heart of social life, offering high-end dining, boutiques, and a lively atmosphere during the summer months.
                            </p>
                            <p>
                                Sotogrande offers a secure and family-oriented environment with an excellent international school and a wide range of outdoor activities. Properties range from stunning marina apartments to grand mansions in the Alto and La Reserva zones, providing peace, privacy, and exclusivity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Sotogrande's Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>Sotogrande Costa</h3>
                            <p>Traditional "Kings & Queens" area.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>The Marina</h3>
                            <p>Waterfront living & dining.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Sotogrande Alto</h3>
                            <p>Golf courses & spacious plots.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>La Reserva</h3>
                            <p>Country club & artificial beach.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>Valderrama</h3>
                            <p>Golf frontline exclusivity.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Torreguadiaro</h3>
                            <p>Beach & tapas bars nearby.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
