import React, { useState } from 'react';
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Gallery from './infos/gallery';
import Documentation from './infos/docs';
import Terms from './infos/terms';
import Welcome from './infos/welcome';
import LoadingScreen from '../loading';
import PrivacyPolicy from './infos/privacy';
import '../../static/css/main.css';
import UploadPanel from './forms/uploadPanel';
import GetStarted from './infos/get_started';
import NotFound from './infos/notFound';

const Main = ({ isUploadPanelVisible, setIsUploadPanelVisible }) => {

  return (
    <main className="section">
        <Suspense fallback={<LoadingScreen isLoading={true} />}>
            <Routes>
                <Route path="/" element={<Welcome setIsUploadPanelVisible={setIsUploadPanelVisible} />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                <Route path="/get_started" element={<GetStarted setIsUploadPanelVisible={setIsUploadPanelVisible} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>

        <UploadPanel isUploadPanelVisible={isUploadPanelVisible} setIsUploadPanelVisible={setIsUploadPanelVisible} />
    </main>
  );
};

export default React.memo(Main);