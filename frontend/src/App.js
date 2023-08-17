import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Pages/Home/Home';
import CreatePost from './Pages/CreatePost/CreatePost';

function App() {

  return (
    <div className="App">
      <Router>
        <div className='navbar'>
          <Link className='nav-link' to="/create-post"> Create A Post </Link>
          <Link className='nav-link' to="/"> Home Page </Link>
        </div>

        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
