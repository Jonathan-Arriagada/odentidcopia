import { useContext, useState } from "react";
import "./Login.css";
import logo from "../img/logo-odentid.png";
import {signInWithEmailAndPassword,sendPasswordResetEmail, signOut} from "firebase/auth";
import { auth } from "../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Modal } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailReseteo, setEmailReseteo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
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
              
              if (doc.data().rol === "Ks3n7p9Rv2wT") {
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
      .catch((error) => {
        setError(true);
        const errorMessage = error.message;
        setErrorMsg(errorMessage);
      });
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

  return (
    <>
      <div className="login-page">
        <img className="logo" src={logo} alt="Odentid" />

        <form>
          <div className="email">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="password">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
            <label htmlFor="password">Contraseña</label>
          </div>
          {error && (
            <span className="error">Email o Contraseña incorrectos.</span>
          )}
          {error && <span className="error">{errorMsg}</span>}
          <button type="submit" onClick={submit}>
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
