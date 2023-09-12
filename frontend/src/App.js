import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Components/Home/Home';
import CreatePost from './Components/CreatePost/CreatePost';
import Post from './Components/Post/Post';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import EditProfile from './Components/EditProfile/EditProfile';
import PageNotFound from './Components/PageNotFound/PageNotFound';

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
    window.location.replace('/');
  };

  return (
    <div className="App">

      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className='navbar'>
            {!authState.status ? (
              <>
                <Link className='nav-link' to="/login"> Login </Link>
                <Link className='nav-link' to="/register"> Register </Link>
              </>
            ) : (
              <>
                <Link className='nav-link' to="/"> Home Page </Link>
                <div className='nav-right'>
                  <p className='username' onClick={() => window.location.replace(`/profile/${authState.id}`)}>
                    {authState.username}
                  </p>
                  <button onClick={logout}> Logout </button>
                </div>
              </>
            )}
          </div>

          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile/:id' element={<Profile/>}/>
            <Route path='/edit-profile' element={<EditProfile/>}/>
            <Route path='/post/:id' element={<Post/>}/>
            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
