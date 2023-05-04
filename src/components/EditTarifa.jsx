import React, { useState } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditTarifa = (props) => {
  const [codigo, setCodigo] = useState(props.tarifa.codigo || "");
  const [tratamiento,setTratamiento] = useState(props.tarifa.tratamiento || "");
  const [tarifa, setTarifa] = useState(props.tarifa.tarifa || "");

  const update = async (e) => {
    e.preventDefault();
    const tarifaRef = doc(db, "tarifas", props.id);
    const tarifaDoc = await getDoc(tarifaRef);
    const tarifaData = tarifaDoc.data();
  
  const newData = {
    codigo: codigo || tarifaData.codigo,
    tratamiento: tratamiento || tarifaData.tratamiento,
    tarifa: tarifa || tarifaData.tarifa, 
  };
  await updateDoc(tarifaRef, newData);
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
          <h1>Editar Tarifa</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Codigo</label>
                  <input
                    defaultValue={props.tarifa.codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value)
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input
                    defaultValue={props.tarifa.tratamiento}
                    onChange={(e) => {
                      setTratamiento(e.target.value);
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tarifa</label>
                  <input
                    defaultValue={props.tarifa.tarifa}
                    onChange={(e) => {
                      setTarifa(e.target.value)
                    }}
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

export default EditTarifa;