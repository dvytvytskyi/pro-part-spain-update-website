import { useLanguage } from '../i18n/LanguageContext';

export default function AboutUs() {
    const { t } = useLanguage();
    return (
        <div className="page-container">
            <h1>{t('nav.about')}</h1>
            <p>{t('about.description')}</p>
        </div>
    );
}
