import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* UI Components */}

          {/* UI Pages */}
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home/>}/>

          {/* UI Admin */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
