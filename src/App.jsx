import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './layouts/Layout';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const NewBuilding = lazy(() => import('./pages/NewBuilding'));
const Secondary = lazy(() => import('./pages/Secondary'));
const Rent = lazy(() => import('./pages/Rent'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Areas = lazy(() => import('./pages/Areas'));
const Marbella = lazy(() => import('./pages/Marbella'));
const Estepona = lazy(() => import('./pages/Estepona'));
const Mijas = lazy(() => import('./pages/Mijas'));
const Benahavis = lazy(() => import('./pages/Benahavis'));
const Sotogrande = lazy(() => import('./pages/Sotogrande'));
const Casares = lazy(() => import('./pages/Casares'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const News = lazy(() => import('./pages/News'));
const NewsArticle = lazy(() => import('./pages/NewsArticle'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const LikedPage = lazy(() => import('./pages/LikedPage'));

const Loading = () => <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
            <Route path="new-building" element={<Suspense fallback={<Loading />}><NewBuilding /></Suspense>} />
            <Route path="new-building/:id" element={<Suspense fallback={<Loading />}><PropertyDetails /></Suspense>} />
            <Route path="secondary" element={<Suspense fallback={<Loading />}><Secondary /></Suspense>} />
            <Route path="secondary/:id" element={<Suspense fallback={<Loading />}><PropertyDetails /></Suspense>} />
            <Route path="resale" element={<Suspense fallback={<Loading />}><Secondary /></Suspense>} />
            <Route path="resale/:id" element={<Suspense fallback={<Loading />}><PropertyDetails /></Suspense>} />
            <Route path="rent" element={<Suspense fallback={<Loading />}><Rent /></Suspense>} />
            <Route path="rent/:id" element={<Suspense fallback={<Loading />}><PropertyDetails /></Suspense>} />
            <Route path="map" element={<Suspense fallback={<Loading />}><MapPage /></Suspense>} />
            <Route path="areas" element={<Suspense fallback={<Loading />}><Areas /></Suspense>} />
            <Route path="areas/marbella" element={<Suspense fallback={<Loading />}><Marbella /></Suspense>} />
            <Route path="areas/estepona" element={<Suspense fallback={<Loading />}><Estepona /></Suspense>} />
            <Route path="areas/mijas" element={<Suspense fallback={<Loading />}><Mijas /></Suspense>} />
            <Route path="areas/benahavis" element={<Suspense fallback={<Loading />}><Benahavis /></Suspense>} />
            <Route path="areas/sotogrande" element={<Suspense fallback={<Loading />}><Sotogrande /></Suspense>} />
            <Route path="areas/casares" element={<Suspense fallback={<Loading />}><Casares /></Suspense>} />
            <Route path="about" element={<Suspense fallback={<Loading />}><AboutUs /></Suspense>} />
            <Route path="contact" element={<Suspense fallback={<Loading />}><Contact /></Suspense>} />
            <Route path="privacy" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
            <Route path="terms" element={<Suspense fallback={<Loading />}><Terms /></Suspense>} />
            <Route path="cookies" element={<Suspense fallback={<Loading />}><Cookies /></Suspense>} />
            <Route path="news" element={<Suspense fallback={<Loading />}><News /></Suspense>} />
            <Route path="news/:id" element={<Suspense fallback={<Loading />}><NewsArticle /></Suspense>} />
            <Route path="liked" element={<Suspense fallback={<Loading />}><LikedPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
