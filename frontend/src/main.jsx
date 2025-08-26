import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import AuthProvider from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { store } from '@/state/store';

import Router from './Router';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Provider store={store}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Provider>
  </ThemeProvider>,
);
