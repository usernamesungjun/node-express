import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './collaboflow/header';
import Slidebar from './collaboflow/slidebar';
import Login from './collaboflow/login';
import Register from './collaboflow/register';
import Work from './collaboflow/work';
import Mypage from './collaboflow/mypage'
import Document from './collaboflow/document';
import Project from './collaboflow/project';
//import DashBoard from './collaboflow/dashboard';

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
        <Route path="/mypage" element={
          <>
            <Header />
            <Slidebar />
            <Mypage />
          </>
        } />
        <Route path="/project/document" element={
          <>
            <Header />
            <Slidebar />
            <Document />
          </>
        } />
        <Route path="/project" element={
          <>
            <Header />
            <Slidebar />
            <Project />
          </>
        } />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
