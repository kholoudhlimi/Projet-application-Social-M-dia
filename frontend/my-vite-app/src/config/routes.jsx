import { createBrowserRouter } from "react-router-dom";
import Register from '../pages/register';
import Login from '../pages/login';
import Home from '../pages/home';
import PageNotFound from "../pages/pageNotFound";
import Admin from "../pages/admin";


const router = createBrowserRouter([
  {
    path: '/',
    element: <div>home page</div>,
    errorElement: <PageNotFound/>
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
    element: <Home/>
  },

{
  path: '/admin',
  element: <Admin/>
},

  
  
        
  
  




]);

export default router;
