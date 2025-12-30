import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <Link to="/" className="footer-logo">
                        <img src="https://res.cloudinary.com/dgv0rxd60/image/upload/v1766757920/spain-real-estate/logo.svg" alt="Spain Real Estate" />
                    </Link>
                    <p className="footer-tagline">
                        {t('footer.tagline')}
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>{t('footer.discover')}</h4>
                    <ul className="footer-links">
                        <li><Link to="/new-building">{t('nav.newBuilding')}</Link></li>
                        <li><Link to="/secondary">{t('nav.secondary')}</Link></li>
                        <li><Link to="/rent">{t('nav.rent')}</Link></li>
                        <li><Link to="/map">{t('nav.map')}</Link></li>
                        <li><Link to="/areas">{t('nav.areas')}</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>{t('footer.company')}</h4>
                    <ul className="footer-links">
                        <li><Link to="/news">{t('nav.news')}</Link></li>
                        <li><Link to="/contact">{t('nav.contact')}</Link></li>
                        <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
                        <li><Link to="/terms">{t('footer.terms')}</Link></li>
                        <li><Link to="/cookies">{t('footer.cookies')}</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>{t('footer.contact')}</h4>
                    <ul className="footer-contact-info">
                        <li>
                            <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>Marina Banus, Block 4,<br />29660 Marbella, Spain</span>
                        </li>
                        <li>
                            <Phone size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <a href="tel:+34951123456" style={{ color: 'inherit' }}>+34 951 123 456</a>
                        </li>
                        <li>
                            <Mail size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <a href="mailto:info@propart.com" style={{ color: 'inherit' }}>info@propart.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} PROPART. {t('footer.rights')}.</p>
                <div className="footer-legal-links">
                    <Link to="/privacy">{t('footer.privacy')}</Link>
                    <Link to="/terms">{t('footer.terms')}</Link>
                    <Link to="/cookies">{t('footer.cookies')}</Link>
                </div>
            </div>
        </footer>
    );
}
