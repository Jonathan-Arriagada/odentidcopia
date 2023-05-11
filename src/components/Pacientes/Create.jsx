import React, { useState, } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Create = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [edad, setEdad] = useState("");
  const [numero, setNumero] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [error, setError] = useState("");

  const clientsCollection = collection(db, "clients");

  const validateFields = async (e) => {
    e.preventDefault();
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      edad.trim() === "" ||
      numero.trim() === ""
    ) {
      setError("Todos los campos son obligatorios");
      setTimeout(clearError, 2000)
      return false;
    } else {
      const querySnapshot = await getDocs(query(clientsCollection, where("idc", "==", idc)));
      if (!querySnapshot.empty) {
        setError("El DNI ya existe en la Base de Datos");
        setTimeout(clearError, 2000)
        return false;
      } else {
        setError("");
        await store();
        clearFields();
        props.onHide();
      }
    }
    return true;
  };

  const clearError = () => {
    setError("");
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setEdad("");
    setNumero("");
    setError("");
  };

  const store = async () => {
    await addDoc(clientsCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      edad: edad,
      numero: numero,
      valorBusqueda: valorBusqueda,
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
          <h1>Crear Cliente</h1>
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
                  <label className="form-label">Apellido y Nombres*</label>
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
                  <label className="form-label">DNI*</label>
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
                  <label className="form-label">Edad*</label>
                  <input
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono*</label>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
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

export default Create;
