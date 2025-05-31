import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './admin/Dashboard';
import ManaUser from './admin/ManaUser';
import ErrorPage from './components/ErrorPage';
import ManaRequest from './admin/ManaRequest';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* UI Components */}
          <Route path='/error' element={<ErrorPage/>}/>

          {/* UI Pages */}
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home/>}/>

          {/* UI Admin */}
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/manaUser' element={<ManaUser/>}/>
          <Route path='/manaRequest' element={<ManaRequest/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
