
import './Style/navBar.css'
import './Style/addBook.css'
import './Style/myBooks.css'
import './Style/home.css'
import './Style/bookDetails.css' 
import { Navbar } from './components/Navbar'
import './Firebase'
import HomeBooks from './components/Pages/Home'
import { Route, Routes } from 'react-router-dom'


import { Login } from './components/Pages/Login'
import { SignUp } from './components/Pages/SignUp'
import PrivateRoute from './components/Context/PrivateRoute'
import AddBook from './components/Pages/AddBooks'
import { MyBooks } from './components/Pages/MyBooks'
import BookDetails from './components/Pages/BookDetails' 


function App() {
 

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<HomeBooks/>}/>
      <Route path='/myBooks' element={<PrivateRoute><MyBooks/></PrivateRoute>}/>
      <Route path='/addBooks' element={<PrivateRoute><AddBook/></PrivateRoute>}/>
        <Route path="/book/:bookId"element={<PrivateRoute><BookDetails /></PrivateRoute>}/>
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
    </>
  )
}

export default App
