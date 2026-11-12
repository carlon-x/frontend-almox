import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Produto from './pages/Produto';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />
        
        {/* Rota Protegida: O Produto só abre se passar pela checagem de Token */}
        <Route 
          path="/produtos" 
          element={
            <PrivateRoute>
              <Produto />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
