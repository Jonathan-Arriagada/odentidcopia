import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateTratamiento(props) {
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [pieza, setPieza] = useState([]);
  const [saldo, setSaldo] = useState("");
  const [estadoPago, setEstadoPago] = useState([]);
  const [estadoTratamiento, setEstadoTratamiento] = useState("");
  const navigate = useNavigate();

  const tratamientosCollection = collection(db, "tratamientos");

  const store = async (e) => {
    e.preventDefault();
    await addDoc(tratamientosCollection, {
      apellido: apellido,
      nombre: nombre,
      tratamiento: tratamiento,
      pieza: pieza,
      saldo: saldo,
      estadoPago: estadoPago,
      estadoTratamiento: estadoTratamiento,
    });
    navigate("/tratamientos");
    window.location.reload(false)
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input
                    value={tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pieza</label>
                  <input
                    value={pieza}
                    onChange={(e) => setPieza(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Saldo</label>
                  <input
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>        
                <div className="mb-1">
                  <label className="form-label">Estado del Pago</label>
                  <input
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado del Tratamiento</label>
                  <input
                    value={estadoTratamiento}
                    onChange={(e) => setEstadoTratamiento(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <button type="submit" onClick={props.onHide} className="btn btn-primary">Agregar</button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateTratamiento;