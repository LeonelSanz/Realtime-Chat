import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from './pages/Login';
import Chat from './pages/Chat';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Chat />} />
    </Routes>
  </BrowserRouter>;
}
