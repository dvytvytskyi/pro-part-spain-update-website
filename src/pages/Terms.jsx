import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Terms() {
    const { t } = useLanguage();
    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1a1a1a' }}>
            <div style={{ padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a', fontWeight: '700' }}>{t('footer.terms')}</h1>
                <p style={{ color: '#555', marginBottom: '2rem', fontWeight: '500' }}>{t('common.lastUpdated')}: {new Date().toLocaleDateString()}</p>
                <div style={{ lineHeight: '1.8', color: '#1a1a1a', fontSize: '1.05rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>1. Terms</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>2. Use License</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>Permission is granted to temporarily download one copy of the materials (information or software) on PROPART's website for personal, non-commercial transitory viewing only.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>3. Disclaimer</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>The materials on PROPART's website are provided on an 'as is' basis. PROPART makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: '600' }}>4. Limitations</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#333' }}>In no event shall PROPART or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PROPART's website.</p>
                </div>
            </div>
        </div>
    );
}
