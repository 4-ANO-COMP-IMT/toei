import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter , Routes, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import Artwork from './pages/artwork'
import Edit from './pages/updateArtwork'
import Create from './pages/create'
import Profile from './pages/updateUser'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/artwork/:artworkId' element={<Artwork/>}/>
        <Route path='/edit/:artworkId' element={<Edit/>}/>
        <Route path='/create/' element={<Create/>}/>
        <Route path='/profile' element={<Profile/>}/>
        {/* Criar uma página pra erro? */}
        <Route path='*' element={<div>404</div>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
