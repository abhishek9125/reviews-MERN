import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ConfirmPassword from './components/auth/ConfirmPassword'
import EmailVerification from './components/auth/EmailVerification'
import ForgetPassword from './components/auth/ForgetPassword'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Navbar from './components/user/Navbar'
// import SingleMovie from './components/user/SingleMovie'
import { useAuth } from './hooks'
import AdminNavigator from './navigator/AdminNavigator'

function App() {

	const { authInfo } = useAuth();
	const isAdmin = authInfo.profile?.role === 'admin';

	// if(isAdmin) {
	// 	return (
	// 		<>
	// 			<AdminNavigator />
	// 		</>
	// 	)
	// }

	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/auth/signin' element={<SignIn />} />
				<Route path='/auth/signup' element={<SignUp />} />
				<Route path='/auth/verification' element={<EmailVerification />} />
				<Route path='/auth/forget-password' element={<ForgetPassword />} />
				<Route path='/auth/reset-password' element={<ConfirmPassword />} />
				{/* <Route path="/movie/:movieId" element={<SingleMovie />} /> */}
				{/* <Route path="/movie/reviews/:movieId" element={<MovieReviews />} />
				<Route path="/movie/search" element={<SearchMovies />} /> */}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	)
}

export default App