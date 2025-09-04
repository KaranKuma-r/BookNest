
import './Style/navBar.css'
import { Navbar } from './components/Navbar'
import './Firebase'
import { Home } from './components/Pages/Home'
import { Route, Routes } from 'react-router-dom'
import { MyBooks } from './components/Pages/MyBooks'
import { AddBooks } from './components/Pages/AddBooks'
import { Login } from './components/Pages/Login'
import { SignUp } from './components/Pages/SignUp'
import PrivateRoute from './components/Context/PrivateRoute'

function App() {
 

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/myBooks' element={<PrivateRoute><MyBooks/></PrivateRoute>}/>
      <Route path='/addBooks' element={<PrivateRoute><AddBooks/></PrivateRoute>}/>
           <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
    </>
  )
}

export default App
