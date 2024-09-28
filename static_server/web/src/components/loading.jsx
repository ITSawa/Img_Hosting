import React from 'react';
import 'bulma/css/bulma.min.css';

const LoadingScreen = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="fixed is-overlay is-flex is-justify-content-center is-align-items-center has-background-black-ter" style={{ zIndex: 50, inset: '0' }}>
        <div className="has-text-centered">
          <button 
            className="button is-loading is-large" 
            style={{ 
              border: 'none', 
              backgroundColor: 'transparent', 
              fontSize: '48px',
              color: '#00d1b2'
            }}>
          </button>
          <div className="is-size-4 mt-4" style={{ color: '#00d1b2' }}>Loading...</div>  {/* Цвет текста */}
        </div>
      </div>
    )
  );
};

export default React.memo(LoadingScreen);