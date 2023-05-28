import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import "../Pacientes/Show.css";
import EditControlEvolucion from "../ControlEvolucion/EditControlEvolucion";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import moment from "moment";
import { Modal } from "react-bootstrap";

function ControlEvolucion(id) {
  const [controles, setControles] = useState([]);
  const [modalShowEditar, setModalShowEditar] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [control, setControl] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalShowVerDetalle, setModalShowVerDetalle] = useState(false);
  const [noHayControles, setnoHayControles] = useState(false);

  const controlesCollectiona = collection(db, "controlEvoluciones");
  const controlesCollection = useRef(query(controlesCollectiona, orderBy("fechaControlRealizado", "desc"))
  );

  const getControles = useCallback((snapshot) => {
    const controlesArray = snapshot.docs
      .filter((doc) => doc.data().idPaciente === id.id)
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    setControles(controlesArray);
    if (controlesArray.length === 0) {
      setnoHayControles(true)
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(controlesCollection.current, getControles);
    return unsubscribe;
  }, [getControles]);

  const deleteControl = async (id) => {
    const clientDoc = doc(db, "controlEvoluciones", id);
    await deleteDoc(clientDoc);
    setControles((prevControl) =>
      prevControl.filter((control) => control.id !== id)
    );
  };

  let results = controles;

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...controles].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setControles(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...controles].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setControles(sorted);
      setOrder("ASC");
    }
  };

  return (
    <>
      <div className="mainpage">
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <>
            {noHayControles ? (
              <div className="container mt-2 mw-100" >
                <div className="row">
                  <h1>A este paciente no se le han registrado Controles y Evoluciones aún</h1>
                </div>
              </div>
            ) : (
              <div className="w-100">
                <div className="container mw-100">
                  <div className="row">
                    <div className="col">
                      <br></br>
                      <div className="d-flex justify-content-between">
                        <h3>Control y Evoluciones del Paciente</h3>
                      </div>
                      <table className="table__body">
                        <thead>
                          <tr>
                            <th>N°</th>
                            <th onClick={() => sorting("apellidoConNombre")}>
                              Apellido Y Nombres
                            </th>
                            <th onClick={() => sorting("idc")}>DNI</th>
                            <th onClick={() => sorting("tratamiento")}>Tratamiento</th>
                            <th onClick={() => sorting("pieza")}>Pieza</th>
                            <th onClick={() => sorting("doctor")}>Doctor</th>
                            <th onClick={() => sorting("fechaControlRealizado")}>Fecha</th>
                            <th>Accion</th>
                          </tr>
                        </thead>

                        <tbody>
                          {results.map((control, index) => (
                            <tr key={control.id}>
                              <td>{results.length - index}</td>
                              <td> {control.apellidoConNombre} </td>
                              <td> {control.idc} </td>
                              <td> {control.tratamientoControl} </td>
                              <td> {control.pieza} </td>
                              <td> {control.doctor} </td>
                              <td>
                                {moment(control.fechaControlRealizado).format(
                                  "DD/MM/YY"
                                )}
                              </td>

                              <td style={{ padding: "10px" }}>
                                <button
                                  variant="primary"
                                  className="btn btn-secondary mx-1"
                                  onClick={() => {
                                    setModalShowVerDetalle([
                                      true,
                                      control.detalleTratamiento,
                                    ]);
                                  }}>
                                  <i className="fa-regular fa-comment"></i> Ver
                                  Notas
                                </button>
                                <button
                                  variant="primary"
                                  className="btn btn-success mx-1"
                                  onClick={() => {
                                    setModalShowEditar(true);
                                    setControl(control);
                                    setIdParam(control.id);
                                  }}
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    deleteControl(control.id);
                                  }}
                                  variant="primary"
                                  className="btn btn-danger mx-1"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {modalShowVerDetalle[0] && (
                        <Modal
                          show={modalShowVerDetalle[0]}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          onHide={() => setModalShowVerDetalle([false, ""])}
                        >
                          <Modal.Header
                            closeButton
                            onClick={() => setModalShowVerDetalle([false, ""])}
                          >
                            <Modal.Title>Detalle</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="container">
                              <div className="col">
                                <form>
                                  <div className="row">
                                    <div className="col mb-6">
                                      <p>{modalShowVerDetalle[1]}</p>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EditControlEvolucion
        id={idParam}
        control={control}
        show={modalShowEditar}
        onHide={() => setModalShowEditar(false)}
      />
    </>
  );
};

export default ControlEvolucion;