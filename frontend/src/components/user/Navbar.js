import React from "react";
import { BsFillSunFill } from 'react-icons/bs';
import { Link } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import Container from "../Container";

function Navbar() {

	const { toggleTheme } = useTheme();
	const { authInfo, handleLogout } = useAuth();
	const { isLoggedIn } = authInfo;

	return (
		<div className="bg-secondary shadow-sm shadow-gray-500">
			<Container className="p-2">
				<div className="flex justify-between items-center">
					<Link to='/'>
						<img src="./logo.png" alt="logo" className="h-10" />
					</Link>
					<ul className="flex items-center space-x-4">
						<li>
							<button className="bg-dark-subtle dark:bg-white p-1 rounded" onClick={() => toggleTheme()}>
								<BsFillSunFill className="text-secondary" size={24} />
							</button>
						</li>
						<li>
							<input  
								type="text"
								placeholder="Search..."
								className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
							/>
						</li>
						<li>
							{
								isLoggedIn ?
								<button onClick={handleLogout} className="text-white font-semibold text-lg">
									Logout
								</button> 
								: <Link className="text-white font-semibold text-lg" to='/auth/signin'>
									Login	
								</Link>
							}
						</li>
					</ul>
				</div>

			</Container>
		</div>
	);
}

export default Navbar;