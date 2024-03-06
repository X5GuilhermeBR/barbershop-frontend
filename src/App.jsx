import React from 'react'
import {
	Route,
	BrowserRouter as Router,
	Routes
} from 'react-router-dom'
import SignIn from './pages/signIn/signIn'

function App() {
	return (
	  <Router>
		<Routes>
		  <Route path="/sign-in" element={<SignIn />} />
		</Routes>
	  </Router>
	);
  }
export default App;
