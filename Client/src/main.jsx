import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../i18n';
import { SocketContextProvider } from './context/SocketContext';
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          <ThemeProvider>
            <SidebarProvider>
              <App />  {/* App includes RouterProvider */}
            </SidebarProvider>
          </ThemeProvider>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);