import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Edit = (props) => {
    const [nombre, setNombre] = useState(props.client.nombre || "");
    const [apellido, setApellido] = useState(props.client.apellido || "");
    const [idc, setIdc] = useState(props.client.idc || "");
    const [edad, setEdad] = useState(props.client.edad || "");
    const [numero, setNumero] = useState(props.client.numero || "");

  const navigate = useNavigate();

  const update = async (e) => {
    e.preventDefault();
    const clientRef = doc(db, "clients", props.id);
    const clientDoc = await getDoc(clientRef);
    const clientData = clientDoc.data();
  
  const newData = {
    nombre: nombre || clientData.nombre,
    apellido: apellido || clientData.apellido,
    idc: idc || clientData.idc,
    edad: edad || clientData.edad,
    numero: numero || clientData.numero,
  };
  await updateDoc(clientRef, newData);
    navigate("/clients");
    window.location.reload(false);
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
          <h1>Editar Cliente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    defaultValue={props.client.nombre}
                    onChange={(e) => setNombre(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    defaultValue={props.client.apellido}
                    onChange={(e) => setApellido(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.client.idc}
                    onChange={(e) => setIdc(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    defaultValue={props.client.edad}
                    onChange={(e) => setEdad(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero</label>
                  <input
                    defaultValue={props.client.numero}
                    onChange={(e) => setNumero(e.currentTarget.value)}
                    type="number"
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
                  Editar
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Edit;