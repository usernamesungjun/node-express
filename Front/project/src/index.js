import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './collaboflow/header';
import Slidebar from './collaboflow/slidebar';
import Login from './collaboflow/login';
import Register from './collaboflow/register';
import Work from './collaboflow/work';

import './index.css'
import 'popper.js';
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/project/:projectName/*" element={<Project />} /> */}
        <Route index element={<Navigate to="/login" />} />
        <Route path="project/works" element={
          <>
            <Header />
            <Slidebar />
            <Work />
          </>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
