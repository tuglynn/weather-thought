import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import Title from './Title ';

const Header = ({isAuthenticated, onLogout}) => {
    useEffect(() => {
        console.log('header rendering | Authenticated is set to ', isAuthenticated)
    })

    
     return(
         <header className='App-header'>
            <ul className='navBar d-flex flex-row justify-content-start'>
                <li>
                <Link to='/weather-thought'><Title/></Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link to='/new'>New Post</Link>
                        </li>
                        <li>
                            <p onClick={onLogout}>Logout</p>
                        </li>
                    </>)
                 : (<li>
                    <Link to='/login'>Login</Link>
                </li>)}
            </ul>
         </header>
     )
 }
 
 export default Header;