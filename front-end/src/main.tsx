import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter , Routes, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './pages/registerUser'
import Login from './pages/login'
import Home from './pages/home'
import ReadArtwork from './pages/readArtwork'
import UpdateArtwork from './pages/updateArtwork'
import CreateArtwork from './pages/createArtwork'
import UpdateUser from './pages/updateUser'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/artwork/:artworkId' element={<ReadArtwork/>}/>
        <Route path='/edit/:artworkId' element={<UpdateArtwork/>}/>
        <Route path='/create/' element={<CreateArtwork/>}/>
        <Route path='/profile' element={<UpdateUser/>}/>
        {/* Criar uma página pra erro? */}
        <Route path='*' element={<div>404</div>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
