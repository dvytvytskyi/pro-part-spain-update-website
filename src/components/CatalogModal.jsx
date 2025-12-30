import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { countryCodes } from '../data/countryCodes';
import './CatalogModal.css';

import { useLanguage } from '../i18n/LanguageContext';

export default function CatalogModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    if (!isOpen) return null;

    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+34');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', { countryCode, phone });
        // Add submission logic here (API call etc)
        onClose();
        alert(t('catalog.success'));
    };

    return (
        <div className="catalog-modal-overlay" onClick={onClose}>
            <div className="catalog-modal-container" onClick={e => e.stopPropagation()}>
                <div className="catalog-modal-left">
                    <div className="catalog-modal-brand">ProPart Real Estate</div>
                    <h2 className="catalog-modal-title">
                        {t('catalog.title')} <span>{t('catalog.highlight')}</span>
                    </h2>
                    <p className="catalog-modal-description">
                        {t('catalog.description')}
                    </p>

                    <form className="catalog-form" onSubmit={handleSubmit}>
                        <div className="phone-input-group">
                            <div className="country-select-wrapper">
                                <select
                                    className="country-select"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code + country.name} value={country.code}>
                                            {country.flag} {country.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="country-arrow" />
                            </div>
                            <input
                                type="tel"
                                className="phone-input"
                                placeholder={t('catalog.phonePlaceholder')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            {t('catalog.submit')}
                        </button>
                    </form>

                    <div className="catalog-modal-footer">
                        {t('catalog.recaptcha')} <a href="/privacy">{t('footer.privacy')}</a>
                    </div>
                </div>

                <div className="catalog-modal-right">
                    <button className="close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
