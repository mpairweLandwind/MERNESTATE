// src/index.js or src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SocketContextProvider } from './context/SocketContext';
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './Loader';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <SocketContextProvider>
          <ThemeProvider>
            <SidebarProvider>
              <I18nextProvider i18n={i18n}>
              <ErrorBoundary>
                <App />
                </ErrorBoundary>
              </I18nextProvider>
            </SidebarProvider>
          </ThemeProvider>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
