import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store';
import { Provider } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
