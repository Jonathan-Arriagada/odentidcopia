import { useContext, useState } from 'react';
import './Login.css'
import logo from '../img/logo-odentid.png'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const navigate = useNavigate()

    const {dispatch} = useContext(AuthContext)

    const submit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            const user = userCredential.user
            dispatch({type:"LOGIN", payload:user})
            navigate("/clients")
        })
        .catch((error) => {
            setError(true)
            const errorMessage = error.message;
            setErrorMsg(errorMessage);
        })
        // <Link to={../ ${props.link}}
    }

    return (
        <div className='login-page'>

            <img className="logo" src={logo} alt="Odentid"/>

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
    );
};

export default Login;