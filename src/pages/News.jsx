import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getNews } from '../api/client';
import './News.css';

export default function News() {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            const data = await getNews();
            setNews(data || []);
            setLoading(false);
        };
        fetchNews();
    }, []);

    // Date formatter
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(
            language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'en-GB',
            options
        );
    };

    return (
        <div className="news-page">
            <div className="news-container">
                <div className="news-header">
                    <h1 className="news-title">{t('pages.newsPage.title')}</h1>
                    <p className="news-subtitle">{t('pages.newsPage.subtitle')}</p>
                </div>

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
                        {t('common.loading')}
                    </div>
                ) : news.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
                        {t('common.noResults')}
                    </div>
                ) : (
                    <div className="news-grid">
                        {news.map((item) => {
                            const title = item['title_' + language] || item.title_en || item.title;
                            const description = item['description_' + language] || item.description_en || item.description;

                            return (
                                <div
                                    key={item.id}
                                    className="news-card"
                                    onClick={() => navigate(`/news/${item.id}`)}
                                >
                                    <div className="news-image-wrapper">
                                        <img
                                            src={item.featured_image_url || item.image_url || '/placeholder.jpg'}
                                            alt={title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; // Better fallback
                                            }}
                                        />
                                    </div>
                                    <div className="news-content">
                                        <span className="news-date">
                                            {formatDate(item.created_at)}
                                        </span>
                                        <h3 className="news-card-title">
                                            {title}
                                        </h3>
                                        <p className="news-excerpt">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
