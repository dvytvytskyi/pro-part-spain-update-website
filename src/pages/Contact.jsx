import { useLanguage } from '../i18n/LanguageContext';

export default function Contact() {
    const { t } = useLanguage();
    return (
        <div className="page-container">
            <h1>{t('nav.contact')}</h1>
            <p>{t('header.contactUs')}</p>
        </div>
    );
}
