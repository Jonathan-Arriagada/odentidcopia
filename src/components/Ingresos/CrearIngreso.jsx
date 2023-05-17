import React, { useState, } from "react";
import { collection, addDoc, } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const CrearIngreso = (props) => {
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [metodoPagoIngreso, setMetodoPagoIngreso] = useState("");
  const [importeIngreso, setImporteIngreso] = useState("");
  const [ctaTratamiento, ] = useState("");
  const [paciente, ] = useState("");
  const [tratamientoIngreso, setTratamientoIngreso] = useState("");
  const [error, setError] = useState("");

  const ingresosCollection = collection(db, "ingresos");

  const validateFields = async (e) => {
    e.preventDefault();
    if (fechaIngreso.trim() === "" ||
      metodoPagoIngreso.trim() === "" ||
      importeIngreso.trim() === "" ||
      tratamientoIngreso.trim() === "" 
    ) {
      setError("Todos los campos son obligatorios");
      setTimeout(clearError, 2000)
      return false;
    } else {
        setError("");
        await store();
        clearFields();
        props.onHide();
    }
    return true;
  };

  const clearError = () => {
    setError("");
  };

  const clearFields = () => {
    setFechaIngreso("");
    setMetodoPagoIngreso("");
    setImporteIngreso("");
    setTratamientoIngreso("");
    setError("");
  };

  const store = async () => {
    await addDoc(ingresosCollection, {
      fechaIngreso: fechaIngreso,
      metodoPagoIngreso: metodoPagoIngreso,
      importeIngreso: importeIngreso,
      ctaTratamiento: ctaTratamiento,
      tratamientoIngreso: tratamientoIngreso,
      paciente: paciente,
    });
  };


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => {clearFields(); props.onHide();}}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Ingreso</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form>
              {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Fecha Ingreso*</label>
                  <input
                    value={fechaIngreso}
                    onChange={(e) => {
                      setFechaIngreso(e.target.value);
                    }}
                    type="date"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Metodo Pago*</label>
                  <input
                    value={metodoPagoIngreso}
                    onChange={(e) => {
                      setMetodoPagoIngreso(e.target.value);
                    }}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Importe*</label>
                  <input
                    value={importeIngreso}
                    onChange={(e) => setImporteIngreso(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento Cobrado*</label>
                  <input
                    value={tratamientoIngreso}
                    onChange={(e) => setTratamientoIngreso(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <button
                  type="submit"
                  onClick={validateFields}
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

export default CrearIngreso;
