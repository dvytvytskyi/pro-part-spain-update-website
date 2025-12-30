import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById } from '../api/client';
import { ChevronRight, Calendar } from 'lucide-react';
import '../components/listing/ListingComponents.css'; // Reusing some basic styles

import { useLanguage } from '../i18n/LanguageContext';

export default function NewsArticle() {
    const { t, language } = useLanguage();
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            const data = await getNewsById(id);
            setArticle(data);
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '140px', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="skeleton-pulse" style={{ width: '100%', maxWidth: '800px', height: '400px', borderRadius: '16px' }}></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="container" style={{ marginTop: '140px', textAlign: 'center' }}>
                <h2>{t('pages.newsPage.notFound')}</h2>
                <Link to="/news" className="back-link">{t('pages.newsPage.backToNews')}</Link>
            </div>
        );
    }

    // Determine content fields based on potential API structure (falling back to English)
    // Determine content fields based on potential API structure (falling back to English)
    const title = article['title_' + language] || article.title_en || article.title;
    const content = article['content_' + language] || article.content_en || article.content || article.description_en || '';
    const date = new Date(article.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const image = article.featured_image_url || article.image_url || '/placeholder.jpg';

    return (
        <div className="news-article-page">
            <style>{`
                .news-article-page {
                    padding-top: 120px;
                    padding-bottom: 4rem;
                }
                .article-container {
                    max-width: 900px; /* Readability width */
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .breadcrumbs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }
                .breadcrumbs a {
                    color: #888;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .breadcrumbs a:hover {
                    color: #313131;
                }
                .breadcrumb-current {
                    color: #313131;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .article-image {
                    width: 100%;
                    height: auto;
                    max-height: 600px;
                    object-fit: cover;
                    border-radius: 16px;
                    margin-bottom: 3rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .article-header {
                    margin-bottom: 2rem;
                }
                .article-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a1a1a; /* Standard dark color */
                    line-height: 1.2;
                    margin-bottom: 1rem;
                    font-family: 'Poppins', sans-serif;
                }
                .article-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.95rem;
                }
                .article-content {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #444;
                    font-family: 'Poppins', sans-serif;
                }
                .article-content h2, .article-content h3 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #1a1a1a; /* Standard dark color */
                    font-family: 'Poppins', sans-serif;
                }
                .article-content p {
                    margin-bottom: 1.5rem;
                }
                .article-content ul {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .article-content img {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                @media (max-width: 768px) {
                    .news-article-page {
                        padding-top: 90px;
                    }
                    .article-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="article-container">
                <div className="breadcrumbs">
                    <Link to="/">{t('nav.home')}</Link>
                    <ChevronRight size={14} />
                    <Link to="/news">{t('nav.news')}</Link>
                    <ChevronRight size={14} />
                    <span className="breadcrumb-current">{title}</span>
                </div>

                <div className="article-header">
                    {/* Title Top based on screenshot 2? No, Screenshot 0 shows image first? 
                        Wait, Screenshot 0: Image -> Title 
                        Screenshot 1: Title -> Date -> Text
                        I'll stick to Image -> Title to match the "hero" feel, or Title -> Image if standard blog.
                        Let's do Image first as it looks more modern "Hero".
                     */}
                    <img src={image} alt={title} className="article-image" />

                    <h1 className="article-title">{title}</h1>

                    <div className="article-meta">
                        <Calendar size={16} />
                        <span>{date}</span>
                    </div>
                </div>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}
