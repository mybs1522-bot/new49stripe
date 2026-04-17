import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import OnetimePage from './pages/OnetimePage';
import OfferPage from './pages/OfferPage';
import SketchupLandingPage from './pages/SketchupLandingPage';
import SketchupCheckoutPage from './pages/SketchupCheckoutPage';
import RenderUpsellPage from './pages/RenderUpsellPage';
import AdminPage from './pages/AdminPage';
import PageLoader from './components/PageLoader';

const App: React.FC = () => {
  const { pathname } = useLocation();
  const showLoader = pathname === '/sketchup';
  const [loading, setLoading] = useState(showLoader);

  useEffect(() => {
    setLoading(showLoader);
  }, [showLoader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLoaderDone = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <PageLoader onDone={handleLoaderDone} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/render-upsell" element={<RenderUpsellPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/sketchup" element={<SketchupLandingPage />} />
        <Route path="/sketchup-checkout" element={<SketchupCheckoutPage />} />
        <Route path="/onetime" element={<OnetimePage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
};

export default App;