import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import NewBuilding from './pages/NewBuilding';
import Secondary from './pages/Secondary';
import Rent from './pages/Rent';
import MapPage from './pages/MapPage';
import Areas from './pages/Areas';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import PropertyDetails from './pages/PropertyDetails';
import LikedPage from './pages/LikedPage';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="new-building" element={<NewBuilding />} />
            <Route path="new-building/:id" element={<PropertyDetails />} />
            <Route path="secondary" element={<Secondary />} />
            <Route path="secondary/:id" element={<PropertyDetails />} />
            <Route path="resale" element={<Secondary />} /> {/* Alias if needed */}
            <Route path="resale/:id" element={<PropertyDetails />} />
            <Route path="rent" element={<Rent />} />
            <Route path="rent/:id" element={<PropertyDetails />} />
            <Route path="map" element={<MapPage />} />
            <Route path="areas" element={<Areas />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsArticle />} />
            <Route path="liked" element={<LikedPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
