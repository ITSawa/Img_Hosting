import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import LoadingScreen from './components/loading';
import Main from './components/main/main';
import 'bulma/css/bulma.min.css';
import './static/css/index.css';


const App = () => {
  const [loading, setLoading] = useState(true);
  const [isUploadPanelVisible, setIsUploadPanelVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingScreen isLoading={loading} />}
      {!loading && (
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header setIsUploadPanelVisible={setIsUploadPanelVisible} />
            <Main isUploadPanelVisible={isUploadPanelVisible} setIsUploadPanelVisible={setIsUploadPanelVisible} />
            <Footer />
          </div>
        </Router>
      )}
    </>
  );
};

export default React.memo(App);