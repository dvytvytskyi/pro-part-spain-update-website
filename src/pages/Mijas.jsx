import React from 'react';
import { ArrowLeft, MapPin, Sun, Umbrella, Star, Crown, Anchor, Mountain, Flag, Waves, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Marbella.css';

export default function Mijas() {
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
                        <h1 className="marbella-title">Mijas</h1>
                        <p className="marbella-subtitle">White Village Charm & Coastal Bliss</p>
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
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767187190/areas/mijas-3.jpg"
                            alt="Mijas Landscape"
                            className="marbella-hero-image"
                        />
                    </div>
                    <div className="marbella-hero-image-wrapper">
                        <img
                            src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1767187192/areas/mijas-4.jpg"
                            alt="Mijas Apartments"
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
                                Mijas is a unique municipality that offers two distinct lifestyles: the traditional mountain charm of Mijas Pueblo and the vibrant seaside atmosphere of Mijas Costa. The Pueblo is a classic whitewashed Andalusian village perched high in the mountains, offering breathtaking panoramic views of the coast, donkey taxis, and narrow cobbled streets filled with artisan craft shops.
                            </p>
                            <p>
                                Down by the sea, Mijas Costa includes popular areas like La Cala de Mijas, a former fishing village that has retained its authentic character while developing high-quality residential areas and golf resorts. The area is known for its wide sandy beaches, "chiringuitos" (beach bars), and a relaxed, family-friendly atmosphere.
                            </p>
                            <p>
                                With numerous golf courses, such as La Cala Golf Resort, and easy access to both Fuengirola and Marbella, Mijas is a top choice for those seeking a blend of culture, nature, and coastal living. It provides a diverse range of properties, from rustic fincas in the hills to modern frontline beach apartments.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Sub-areas Grid */}
            <section className="marbella-subareas">
                <div className="marbella-container">
                    <h2 className="section-title">Explore Mijas' Prime Areas</h2>
                    <div className="subareas-grid">
                        <div className="subarea-card dark">
                            <Crown size={32} className="subarea-icon" />
                            <h3>Mijas Pueblo</h3>
                            <p>Historic whitewashed village.</p>
                        </div>
                        <div className="subarea-card light">
                            <Anchor size={32} className="subarea-icon" />
                            <h3>La Cala de Mijas</h3>
                            <p>Beachside village charm.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Mountain size={32} className="subarea-icon" />
                            <h3>Calahonda</h3>
                            <p>Self-sufficient coastal community.</p>
                        </div>
                        <div className="subarea-card light">
                            <Flag size={32} className="subarea-icon" />
                            <h3>Riviera del Sol</h3>
                            <p>Golf & family amenities.</p>
                        </div>
                        <div className="subarea-card dark">
                            <Waves size={32} className="subarea-icon" />
                            <h3>El Chaparral</h3>
                            <p>Pine forests & golf by the sea.</p>
                        </div>
                        <div className="subarea-card light">
                            <Trees size={32} className="subarea-icon" />
                            <h3>Mijas Golf</h3>
                            <p>The valley of golf.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
