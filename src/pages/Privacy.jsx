import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Privacy() {
    const { t } = useLanguage();
    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1a1a1a' }}>
            <div style={{ padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a', fontWeight: '700' }}>{t('footer.privacy')}</h1>
                <p style={{ color: '#555', marginBottom: '2rem', fontWeight: '500' }}>{t('common.lastUpdated')}: {new Date().toLocaleDateString()}</p>
                <div style={{ lineHeight: '1.8', color: '#1a1a1a', fontSize: '1.05rem' }}>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>Your privacy is important to us. It is PROPART's policy to respect your privacy regarding any information we may collect from you across our website.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>1. Information We Collect</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>2. Use of Information</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>We generally use the information we collect to:</p>
                    <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', color: '#333' }}>
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Communicate with you, either directly or through one of our partners</li>
                    </ul>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>3. Data Retention</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>4. Contact Us</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>If you have any questions about our privacy policy, please contact us at info@propart.com.</p>
                </div>
            </div>
        </div>
    );
}
