import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./collaboflow/header";
import Slidebar from "./collaboflow/slidebar"
import Main from "./collaboflow/main"
import Login from './collaboflow/login';
import Register from './collaboflow/register';
import Work from './collaboflow/work';
import './index.css';

import 'popper.js';
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>        
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/work" element={
            <>
              <Header />
              <Slidebar />
              <Work />
            </>
          } />
          <Route index element={<Navigate to="/login" />} />
        </Routes>
    </BrowserRouter>
</React.StrictMode>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();