import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db, auth, } from "../../firebaseConfig/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Modal } from "react-bootstrap";
import moment from 'moment';


const CrearAsistente = (props) => {
  const [codigo, setCodigo] = useState('');
  const [apellidoConNombre, setApellidoConNombre] = useState('');
  const [, setFechaAlta] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('yS3tEzgK9Qp7');
  const [error, setError] = useState('');
  const [editable] = useState(false);

  const userCollection = collection(db, "user");

  useEffect(() => {
    const getCodigo = async () => {
      const querySnapshot = await getDocs(
        query(userCollection, orderBy("codigo", "desc"), limit(1))
      );
      if (!querySnapshot.empty) {
        const maxCodigo = querySnapshot.docs[0].data().codigo;
        setCodigo(Number(maxCodigo) + 1);
      } else {
        setCodigo(1);
      }
    };
    getCodigo();
  }, [userCollection]);


  const store = async (e) => {
    e.preventDefault();
    const { user } = await createUserWithEmailAndPassword(auth, correo, password);

    await user.getIdTokenResult().then(() => {
      return user;
    });

    await addDoc(userCollection, {
      codigo: codigo,
      apellidoConNombre: apellidoConNombre,
      password: password,
      correo: correo,
      telefono: telefono,
      rol: rol,
      fechaAlta: moment(new Date()).format('DD/MM/YY'),
    });
    clearFields();
    props.onHide();
  };

  const clearFields = () => {
    setCodigo("")
    setApellidoConNombre("");
    setCorreo("");
    setPassword("");
    setTelefono("");
    setRol("");
    setFechaAlta("");
    setError("");
  };

  const validateFields = async (e) => {
    const querySnapshot = await getDocs(query(userCollection, where("correo", "==", correo)));
    if (!querySnapshot.empty) {
      setError("El correo ya está registrado");
      setTimeout(clearError, 2000);
      return;
    } else {
      if (apellidoConNombre.trim() === "" || correo.trim() === "" || password.trim() === "") {
        setError("Respeta los campos obligatorios *");
        setTimeout(clearError, 2000);
        return;
      } else {
        if (password.length < 6) {
          setError("El password debe tener al menos 6 caracteres");
          setTimeout(clearError, 2000);
          return;
        } else {
          setError("");
          store(e);
        }
      }
    }
  }

  const clearError = () => {
    setError("");
  };


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => {
        props.onHide();
        clearFields("")
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Asistente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Codigo</label>
                  <input
                    value={codigo}
                    disabled={!editable}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido y Nombres*</label>
                  <input
                    value={apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono</label>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email*</label>
                  <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="email"
                    className="form-control"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password*</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                    minLength={6}
                    autoComplete="off"
                    required
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    type="submit"
                    onClick={validateFields}
                    className="btn btn-primary"
                  >
                    Agregar
                  </button>
                  {error && (
                    <div className="alert alert-danger" role="alert" style={{ margin: '10px' }}>
                      {error}
                    </div>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CrearAsistente;