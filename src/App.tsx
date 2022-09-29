import AuthRouter from './AuthRouter'
import { Provider } from 'react-supabase'
import './App.css';
import React from 'react';
import { supabase } from './supabaseClient'

const App = () => (
  <Provider value={supabase}>
    <AuthRouter />
  </Provider>
)

export default App
