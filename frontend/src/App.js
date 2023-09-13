import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Components/Home/Home';
import Post from './Components/Post/Post';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import EditProfile from './Components/EditProfile/EditProfile';
import PageNotFound from './Components/PageNotFound/PageNotFound';

import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import nav icons
import { HomeOutlined as HomeIcon, 
        Search as SearchIcon, 
        NotificationsOutlined as NotifcationsIcon, 
        EmailOutlined as MessageIcon,
        PersonOutlined as ProfileIcon,
        PendingOutlined as MoreIcon,
        PostAddOutlined as PostIcon
      } from '@mui/icons-material';

import logoIcon from './Images/aribellogo.png';


function App() {

  const [authState, setAuthState] = useState({username: "", id: 0, status: false});
  const [page, SetPage] = useState('home');

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
            <div className='nav-logo'>
              <img className='nav-link' id='logo-icon' alt='logo' src={logoIcon}/>
            </div>
            {!authState.status ? (
              <>
                <Link className='nav-link' to="/login"> Login </Link>
                <Link className='nav-link' to="/register"> Register </Link>
              </>
            ) : (
              <div className='nav-icons'>
                <div className='nav-body'>
                  <Link className='nav-link' to="/" onClick={() => SetPage('home')}> 
                    <HomeIcon className='nav-icon'/>
                    <h3 className={(page === 'home'? 'icon-bold': 'icon-reg')}>Home</h3>
                  </Link>
                  <Link className='nav-link' to="/" onClick={() => SetPage('explore')}>  
                    <SearchIcon className='nav-icon'/>
                    <h3 className={(page === 'explore'? 'icon-bold': 'icon-reg')}>Explore</h3>
                  </Link>
                  <Link className='nav-link' to="/" onClick={() => SetPage('notifications')}> 
                    <NotifcationsIcon className='nav-icon'/>
                    <h3 className={(page === 'notifications'? 'icon-bold': 'icon-reg')}>Notifcations</h3>
                  </Link>
                  <Link className='nav-link' to="/" onClick={() => SetPage('messages')}> 
                    <MessageIcon className='nav-icon'/>
                    <h3 className={(page === 'messages'? 'icon-bold': 'icon-reg')}>Messages</h3>
                  </Link>
                  <Link className='nav-link' to={`/profile/${authState.id}`} onClick={() => SetPage('profile')}> 
                    <ProfileIcon className='nav-icon'/>
                    <h3 className={(page === 'profile'? 'icon-bold': 'icon-reg')}>Profile</h3>
                  </Link>
                  <Link className='nav-link' to="/" onClick={() => SetPage('more')}> 
                    <MoreIcon className='nav-icon'/>
                    <h3 className={(page === 'more'? 'icon-bold': 'icon-reg')}>More</h3>
                  </Link>
                  <Link className='nav-link post-btn' to="/"> 
                    <PostIcon className='nav-icon post-icon'/>
                    <h3>Post</h3>
                  </Link>
                </div>

                <div className='nav-footer'>
                  <div className='nav-profile'>
                    <img className='profile-img' src={logoIcon} alt='profile-img'></img>
                    <p className='username' onClick={() => window.location.replace(`/profile/${authState.id}`)}>
                      {authState.username}
                    </p>
                  </div>
                  <button onClick={logout}> 
                    Logout 
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className='main-page'>
            <Routes>
              <Route exact path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/profile/:id' element={<Profile/>}/>
              <Route path='/edit-profile' element={<EditProfile/>}/>
              <Route path='/post/:id' element={<Post/>}/>
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
