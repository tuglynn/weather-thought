import React, {useState} from 'react';

const Login = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await onLogin(email, password);
        } catch (error) {
            console.error('login failed', error.message);
        }
    }
    return(
        <form className='container' name='login' onSubmit={handleLogin}>
            <label htmlFor='email'>Email:</label>
            <br/>
            <input type='email' onChange={e => setEmail(e.target.value)}/>
            <br/>
            <label htmlFor='password'>Password:</label>  
            <br/>
            <input type='password' onChange={e => setPassword(e.target.value)}/>
            <br/>
            <button type='submit' className='btn' disabled={!email && !password}>
                Login
            </button>
        </form>
    )
};


export default Login;