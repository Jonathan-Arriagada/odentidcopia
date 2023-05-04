import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Create = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState([]);
  const [edad, setEdad] = useState([]);
  const [numero, setNumero] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState("");

  const clientsCollection = collection(db, "clients");

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setEdad("");
    setNumero("");
  };

  const store = async (e) => {
    e.preventDefault();
    await addDoc(clientsCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      edad: edad,
      numero: numero,
      valorBusqueda: valorBusqueda, 
    });
    clearFields();
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
          <h1>Crear Cliente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">

              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    value={apellidoConNombre}
                    onChange={(e) => {
                      setApellidoConNombre(e.target.value);
                      setValorBusqueda(e.target.value + " " + idc);
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    value={idc}
                    onChange={(e) => {
                      setIdc(e.target.value)
                      setValorBusqueda(apellidoConNombre + " " + e.target.value);
                    }}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero</label>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
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
};

export default Create;
