import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Benahavis() {
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
                        <h1 className="marbella-title">Benahavís</h1>
                        <p className="marbella-subtitle">Nature, Luxury & Gastronomy</p>
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
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1/areas/benahavis-1"
                            alt="Benahavís Landscape"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1/areas/benahavis-2"
                            alt="Benahavís Luxury"
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
                                Benahavís is renowned as one of the wealthiest municipalities in Spain and is famously called the "Dining Room of the Costa del Sol" due to its exceptional concentration of high-quality restaurants. Nestled in the mountains just 7km from the coast, it offers a tranquil retreat surrounded by cork oak forests and rivers.
                            </p>
                            <p>
                                The area is home to some of Europe's most exclusive gated communities, including La Zagaleta and El Madroñal, offering unparalleled privacy, security, and luxury. It is a haven for golf lovers, boasting 12 golf courses within its municipal borders.
                            </p>
                            <p>
                                Despite its exclusivity, Benahavís retains the charm of a traditional white village with its narrow, winding streets and Arab heritage. It attracts those seeking a sophisticated lifestyle close to nature, with the glamour of Marbella just a short drive away.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Benahavís' Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>La Zagaleta</h3>
                            <p>Europe's most exclusive address.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>El Madroñal</h3>
                            <p>Country club living in nature.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Los Arqueros</h3>
                            <p>Golf resort living.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>La Quinta</h3>
                            <p>Golf valley extension.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>Los Flamingos</h3>
                            <p>Golf & Villa Padierna Palace.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Benahavís Village</h3>
                            <p>Gastronomic capital charming center.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
