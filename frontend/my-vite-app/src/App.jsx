import'./App.css';


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <div>Home page</div>,
    },

    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/register',
      element: <Register/>
    },

    {
    path: '/home',
    element: < Home/>
  }



  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
