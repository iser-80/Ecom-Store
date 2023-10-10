import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home';
import ProductDetails from './pages/productDetails';
import store from './store.js';
import Cart from './pages/cart';
import Login from './pages/login';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route path='/' element={<Home />} />
      <Route path='/product/:id' element={<ProductDetails />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<Login />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
