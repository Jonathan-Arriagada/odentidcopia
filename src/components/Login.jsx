import { useState } from 'react';
import './Login.css'
import logo from '../img/logo-odentid.png'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig/firebase';

const Login = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const submit = (e) => {
      signInWithEmailAndPassword(auth(),email,password)
      .catch((error) => {
        setError(true)
        const errorMessage = error.message;
        setErrorMsg(errorMessage);
      })
    }

    return (
        <div className='login-page'>

            <img className="logo" src={logo} alt="Odentid"/>

            <h2 className='title'>Iniciar Sesión</h2>
            <form onSubmit={submit}>
                
                <div className="email">
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" required/>
                    <label htmlFor="email">Email</label>
                </div>
                <div className="password">
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" required/>
                    <label htmlFor="password">Contraseña</label>
                </div>
                {error && <span className="error">Email o Contraseña incorrectos.</span>}
                {error && <span className="error">{errorMsg}</span>}
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    )
}

export default Login;