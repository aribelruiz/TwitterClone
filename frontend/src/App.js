import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Pages/Home/Home';
import CreatePost from './Pages/CreatePost/CreatePost';

function App() {

  return (
    <div className="App">
      <Router>
        <Link to="/create-post"> Create A Post </Link>
        <hr></hr>
        <Link to="/"> Home Page </Link>
        <hr></hr>

        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
