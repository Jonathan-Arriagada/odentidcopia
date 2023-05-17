import React, { useState } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditIngreso = (props) => {
  const [fechaIngreso, setFechaIngreso] = useState(props.ingreso.fechaIngreso || "");
  const [metodoPagoIngreso, setMetodoPagoIngreso] = useState(props.ingreso.metodoPagoIngreso || "");
  const [importeIngreso, setImporteIngreso] = useState(props.ingreso.importeIngreso || "");
  const [paciente, ] = useState(props.ingreso.paciente || "");
  const [ctaTratamiento, ] = useState(props.ingreso.ctaTratamiento || "");
  const [tratamientoIngreso, setTratamientoIngreso] = useState(props.ingreso.tratamientoIngreso || "");

  const update = async (e) => {
    e.preventDefault();
    const ingresoRef = doc(db, "ingresos", props.id);
    const ingresoDoc = await getDoc(ingresoRef);
    const ingresoData = ingresoDoc.data();

    const newData = {
      fechaIngreso: fechaIngreso || ingresoData.fechaIngreso,
      metodoPagoIngreso: metodoPagoIngreso || ingresoData.metodoPagoIngreso,
      importeIngreso: importeIngreso || ingresoData.importeIngreso,
      paciente: paciente || ingresoData.paciente,
      ctaTratamiento: ctaTratamiento || ingresoData.ctaTratamiento,
      tratamientoIngreso: tratamientoIngreso || ingresoData.tratamientoIngreso,
    };
    await updateDoc(ingresoRef, newData);
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
          <h1>Editar Ingreso</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Fecha Ingreso</label>
                  <input
                    defaultValue={props.ingreso.fechaIngreso}
                    onChange={(e) => {
                      setFechaIngreso(e.target.value);
                    }}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Metodo Pago</label>
                  <input
                    defaultValue={props.ingreso.metodoPagoIngreso}
                    onChange={(e) => {
                      setMetodoPagoIngreso(e.target.value)
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Importe</label>
                  <input
                    defaultValue={props.ingreso.importeIngreso}
                    onChange={(e) => setImporteIngreso(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento Cobrado</label>
                  <input
                    defaultValue={props.ingreso.tratamientoIngreso}
                    onChange={(e) => setTratamientoIngreso(e.target.tratamientoIngreso)}
                    type="text"
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

export default EditIngreso;