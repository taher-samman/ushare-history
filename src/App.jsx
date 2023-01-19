import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateHomeRoute } from './PrivateHomeRoute';
import { PrivateLoginRoute } from './PrivateLoginRoute';
import { ToastContainer } from 'react-toastify';
import Login from './templates/login';
import Home from './templates/home';
import Loader from './components/loader';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <PrivateHomeRoute>
              <Home />
            </PrivateHomeRoute>
          } />
          <Route path='/login' element={
            <PrivateLoginRoute>
              <Login />
            </PrivateLoginRoute>
          } />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Loader />
    </>
  );
}

export default App;