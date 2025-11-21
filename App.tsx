import React from 'react';
import AppRouter from './src/app/router';
import ErrorBoundary from './src/app/ErrorBoundary';
import Toaster from './src/components/Toaster';
import ConsentBanner from './src/components/ConsentBanner';

/**
 * Root application component. Wraps the router with an error boundary and
 * mounts global UI elements such as the toast container and consent banner.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster />
      <ConsentBanner />
    </ErrorBoundary>
  );
};

export default App;