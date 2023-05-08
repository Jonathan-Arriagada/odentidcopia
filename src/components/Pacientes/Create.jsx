import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Create = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState([]);
  const [edad, setEdad] = useState([]);
  const [numero, setNumero] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [validacion, setValidacion] = useState(false);

  const clientsCollection = collection(db, "clients");

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setEdad("");
    setNumero("");
  };

  const store = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      await addDoc(clientsCollection, {
        apellidoConNombre: apellidoConNombre,
        idc: idc,
        edad: edad,
        numero: numero,
        valorBusqueda: valorBusqueda,
      })
      .then (setValidacion(true))
      clearFields();
    } else {
      setValidacion(false);
      clearFields();
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={props.onHide}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Cliente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={store} noValidate>
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
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">DNI</label>
                  <input
                    value={idc}
                    onChange={(e) => {
                      setIdc(e.target.value);
                      setValorBusqueda(
                        apellidoConNombre + " " + e.target.value
                      );
                    }}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    value={edad}
                    onChange={(e) => { if (e.target.value === ""){ setValidacion(false)} else { setEdad(e.target.value); setValidacion(true)}}}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono</label>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    validacion
                      ? props.onHide()
                      : alert(
                          "Por favor complete todos los campos requeridos."
                        );
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

export default Create;
