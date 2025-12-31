import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Casares() {
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
                        <h1 className="marbella-title">Casares</h1>
                        <p className="marbella-subtitle">Hanging Village & Blue Flag Beaches</p>
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
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767186764/areas/casares-1.jpg"
                            alt="Casares Pueblo"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767186766/areas/casares-2.jpg"
                            alt="Casares Coast"
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
                                Casares is a tale of two magnificent settings: the historic mountain village (pueblo) and the modern coastal developments (costa). Casares Pueblo is one of the most photographed heritage sites in Spain, a "hanging village" of whitewashed houses clinging to the cliffside, crowned by a medieval castle.
                            </p>
                            <p>
                                A short drive down towards the Mediterranean reveals Casares Costa, known for its quieter, high-quality residential complexes and pristine Blue Flag beaches. This area offers a more relaxed pace of life compared to the bustling towns of Marbella and Estepona.
                            </p>
                            <p>
                                Casares is also home to the world-renowned Finca Cortesin, a 5-star luxury resort and golf destination that has hosted the Solheim Cup. Whether you prefer the rustic charm of the mountains or contemporary luxury by the sea, Casares offers a truly authentic Andalusian experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Casares' Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>Finca Cortesin</h3>
                            <p>World-class golf & hotel resort.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>Casares Costa</h3>
                            <p>Beachfront living & tranquility.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Casares Pueblo</h3>
                            <p>Historic mountain village.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>Doña Julia</h3>
                            <p>Golf developments with sea views.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>Playa Ancha</h3>
                            <p>Beautiful natural beaches.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Camarate</h3>
                            <p>Quiet residential valleys.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
