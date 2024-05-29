import React from 'react';
// import useEfect from 'react'; uncomment for testing
import { Link } from 'react-router-dom';
import Title from './Title ';
// import global isAuthenticated
const Header = ({isAuthenticated, onLogout}) => {

    // uncomment for testing
    // useEffect(() => {
    //     console.log('header rendering | Authenticated is set to ', isAuthenticated)
    // });

    
     return(
         <header className='App-header'>
            <ul className='navBar d-flex flex-row justify-content-start'>
                <li>
                    {/* Logo link */}
                <Link to='/weather-thought'><Title/></Link>
                </li>
                {/* check if user is signed in */}
                {isAuthenticated ? (
                    <>
                    {/* display options for being logged in */}
                        <li>
                            <Link to='/new'>New Post</Link>
                        </li>
                        <li>
                            <p onClick={onLogout}>Logout</p>
                        </li>
                    </>)
                    // else return login button
                 : (<li>
                    <Link to='/login'>Login</Link>
                </li>)}
            </ul>
         </header>
     )
 }
 
 export default Header;