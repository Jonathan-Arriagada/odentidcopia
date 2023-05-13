import { useContext, useState } from 'react';
import './Login.css'
import logo from '../img/logo-odentid.png'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebaseConfig/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';

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
            navigate("/agenda")
        })
        .catch((error) => {
            setError(true)
            const errorMessage = error.message;
            setErrorMsg(errorMessage);
        })
        const q = query(collection(db, "user"), where("rol", "==", "admin"));
        getDocs(q).then((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
              const doc = querySnapshot.docs[0];
              console.log(doc.data().rol);
              localStorage.setItem('rol', JSON.stringify(doc.data().rol));
            } else {
              console.log("No se encontraron documentos");
            }
          }).catch((error) => {
            console.log("Error al obtener los documentos: ", error);
          });
    }

    /*OLVIDE MI CLAVE
    import { getAuth, sendPasswordResetEmail } from "firebase/auth";

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // Password reset email sent!
        // ..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
  });*/

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
                <p>Olvidé mi Clave</p>
            </form>
        </div>
    );
};

export default Login;