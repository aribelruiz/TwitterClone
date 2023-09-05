import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Pages/Home/Home';
import CreatePost from './Pages/CreatePost/CreatePost';
import Post from './Pages/Post/Post';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';

import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [authState, setAuthState] = useState({username: "", id: 0, status: false});

  useEffect(() => {
    axios.get("http://localhost:8080/auth/authorized", {headers: {accessToken: localStorage.getItem('accessToken')}})
    .then((res) => {
      if (res.data.error) {
        setAuthState({...authState, status: false});
      } else {
        setAuthState({
          username: res.data.username, 
          id: res.data.id, 
          status: true,
        });
      }
    })    
    // eslint-disable-next-line
  }, []);


  // Function for logging out user
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username: "", id: 0, status: false});
  };

  return (
    <div className="App">

      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className='navbar'>
            <Link className='nav-link' to="/"> Home Page </Link>
            <Link className='nav-link' to="/create-post"> Create A Post </Link>

            {!authState.status ? (
              <>
                <Link className='nav-link' to="/login"> Login </Link>
                <Link className='nav-link' to="/register"> Register </Link>
              </>
            ) : (
              <div className='nav-right'>
                <p className='username'>{authState.username}</p>
                <button onClick={logout}> Logout </button>
              </div>
            )}
          </div>

          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/create-post' element={<CreatePost/>}/>
            <Route path='/post/:id' element={<Post/>}/>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
