import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Pages/Home/Home';
import CreatePost from './Pages/CreatePost/CreatePost';
import Post from './Pages/Post/Post';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';

function App() {

  return (
    <div className="App">
      <Router>
        <div className='navbar'>
          <Link className='nav-link' to="/create-post"> Create A Post </Link>
          <Link className='nav-link' to="/"> Home Page </Link>
          <Link className='nav-link' to="/login"> Login </Link>
          <Link className='nav-link' to="/register"> Register </Link>

        </div>

        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/post/:id' element={<Post/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
