import { useContext, useState } from "react";
import "./Login.css";
import logo from "../img/logo-odentid.png";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Modal } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";


const Login = () => {
  const [email, setEmail] = useState("");
  const [emailReseteo, setEmailReseteo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaResolved, setCaptchaResolved] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleCaptchaResolved = () => {
    setCaptchaResolved(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (captchaResolved) {

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch({ type: "LOGIN", payload: user });
          const q = query(collection(db, "user"), where("correo", "==", email));
          getDocs(q)
            .then((querySnapshot) => {
              if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];

                localStorage.setItem("rol", JSON.stringify(doc.data().rol));

                if (doc.data().rol === process.env.REACT_APP_rolBloq) {
                  // Rol bloqueado, no permitir el inicio de sesión
                  signOut(auth);
                  console.log("El rol está bloqueado");
                } else {
                  // Rol no bloqueado, redirigir al usuario a la página correspondiente
                  navigate("/agenda");
                }
              } else {
                console.log("No se encontraron documentos");
              }
            })
            .catch((error) => {
              console.log("Error al obtener los documentos: ", error);
            });
        })
        .catch(() => {
          setError(true);
          setTimeout(clearError, 3000);
        });
    } else {
      setError2(true)
      setTimeout(clearError, 2000);
    }
  };


  const pedirReseteoClave = (e) => {
    e.preventDefault();
    setMostrarModal(false);
    sendPasswordResetEmail(auth, emailReseteo)
      .then(() => {
        window.alert("Mail con instrucciones para reestablecer clave ENVIADO!");
        setEmailReseteo("");
      })
      .catch((error) => {
        window.alert(
          `Hubo un error al enviar el correo. Intente de nuevo más tarde! ${error.message}`
        );
      });
  };

  const handleModal = (e) => {
    e.preventDefault();
    setMostrarModal(true);
  };

  const clearError = () => {
    setError("");
    setError2("");
  };

  return (
    <>
      <div className="login-page">
        <img className="logo" src={logo} alt="Odentid" />

        <form onSubmit={submit}>
          <div className="email">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="password" style={{ display: "flex" }}>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
            />
            <label htmlFor="password">Contraseña</label>
            <button
              className="password-toggle"
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#000", borderBottom: "1px solid #2BB1FF", borderRadius: "0px" }} // Agrega un margen de valor cero al botón
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && (
            <span className="error">Informacion de Sesion Incorrecta.</span>
          )}

          <div className="captcha" style={{ display: "flex", justifyContent: "center", alignItems: "center", transform: "scale(0.9)" }}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_captcha}
              onChange={handleCaptchaResolved}
            />
          </div>
          {error2 && (
            <span className="error">Captcha Invalido.</span>
          )}

          <button type="submit">
            Iniciar Sesión
          </button>

          <button
            type="button"
            onClick={handleModal}
            style={{
              display: "inline-block",
              width: "150px",
              background: "white",
              color: "black",
              marginLeft: "50px",
              padding: "0",
            }}
          >
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
              Olvidé mi Clave
            </span>
          </button>
        </form>
      </div>

      {mostrarModal && (
        <Modal
          show={mostrarModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>Reestablecer Clave</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="col">
                <form>
                  <div className="row">
                    <div className="col mb-6">
                      <label className="form-label">Ingrese su correo</label>
                      <input
                        onChange={(e) => setEmailReseteo(e.target.value)}
                        type="email"
                        className="form-control"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ display: "flex" }}>
              <button
                type="submit"
                onClick={(e) => {
                  pedirReseteoClave(e);
                  setMostrarModal(false);
                }}
                className="btn btn-primary"
              >
                Enviar Correo
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Login;
