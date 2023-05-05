import React, { useState } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Edit = (props) => {
    const [apellidoConNombre, setApellidoConNombre] = useState(props.client.apellidoConNombre || "");
    const [idc, setIdc] = useState(props.client.idc || "");
    const [edad, setEdad] = useState(props.client.edad || "");
    const [numero, setNumero] = useState(props.client.numero || "");
    const [valorBusqueda, setValorBusqueda] = useState("");

  const update = async (e) => {
    e.preventDefault();
    const clientRef = doc(db, "clients", props.id);
    const clientDoc = await getDoc(clientRef);
    const clientData = clientDoc.data();
  
  const newData = {
    apellidoConNombre: apellidoConNombre || clientData.apellidoConNombre,
    idc: idc || clientData.idc,
    edad: edad || clientData.edad,
    numero: numero || clientData.numero,
    valorBusqueda: valorBusqueda || clientData.valorBusqueda, 
  };
  await updateDoc(clientRef, newData);
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
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    defaultValue={props.client.apellidoConNombre}
                    onChange={(e) => {
                      setApellidoConNombre(e.target.value);
                      setValorBusqueda(e.target.value + " " + (idc || props.client.idc));
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.client.idc}
                    onChange={(e) => {
                      setIdc(e.target.value)
                      setValorBusqueda((apellidoConNombre || props.client.apellidoConNombre) + " " + e.target.value);
                    }}
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