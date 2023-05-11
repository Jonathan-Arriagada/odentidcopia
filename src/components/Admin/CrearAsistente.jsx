import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";


const CrearAsistente = (props) => {
  const [codigo, setCodigo] = useState(null);
  const [apellidoConNombre, setApellidoConNombre] = useState('');
  const [fechaAgregado, setFechaAgregado] = useState(new Date());
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol,setRol] = useState('asistente');
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
      const { user } = await db.auth().createUserWithEmailAndPassword(email, password);
      await user.getIdTokenResult().then(() => {
        return user.setCustomClaims({ role: 'asistente' });
      });

      await addDoc(userCollection, {
        codigo: codigo,
        apellidoConNombre: apellidoConNombre,
        password: password,
        email: email,
        telefono: telefono,
        rol :rol,
        fechaAgregado: fechaAgregado,
      });
      clearFields();
      props.onHide();
  };

  const clearFields = () => {
    setCodigo("")
    setApellidoConNombre("");
    setEmail("");
    setPassword("");
    setTelefono("");
    setRol("");
    setFechaAgregado("");
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
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    value={apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
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
                  <label className="form-label">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  onClick={() => {
                    props.onHide();
                  }}
                  className="btn btn-primary"
                >
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CrearAsistente;