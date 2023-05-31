import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import "../Pacientes/Show.css";
import EditControlEvolucion from "../ControlEvolucion/EditControlEvolucion";
import "../Utilidades/loader.css";
import moment from "moment";
import CrearControlEvolucion from "../ControlEvolucion/CrearControlEvolucion";

function ControlEvolucion(id) {
  const [controles, setControles] = useState([]);
  const [apellidoPaciente, setApellidoPaciente] = useState([]);
  const [idcPaciente, setIdcPaciente] = useState([]);

  const [modalShowEditar, setModalShowEditar] = useState(false);
  //const [order, setOrder] = useState("ASC");
  const [control, setControl] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalShowCrearControl, setModalShowCrearControl] = useState(false);
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
    if (controlesArray.length === 0) {
      setnoHayControles(true);
    }
    else {
      setControles(controlesArray);
      setApellidoPaciente(controlesArray[0].apellidoConNombre);
      setIdcPaciente(controlesArray[0].idc)
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

  /*const sorting = (col) => {
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
  };*/

  return (
    <>
      <div className="mainpage">
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <>
            {noHayControles ? (
              !id.id ? (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>No se ha seleccionado un Paciente.</h1>
                  </div>
                </div>
              ) : (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>A este paciente no se le han registrado Controles y Evoluciones aún.</h1>
                    <button
                      variant="primary"
                      className="btn-blue w-25 m-auto mt-5"
                      onClick={() => setModalShowCrearControl(true)}
                    >
                      Crear Nuevo Control
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="w-100">
                <div className="container mw-100">
                  <div className="row">
                    <div className="col">
                      <br></br>
                      <div className="d-flex justify-content-between">
                        <h3>Control y Evoluciones del Paciente</h3>
                        <div className="col d-flex align-items-center justify-content-end">
                          <button
                            variant="primary"
                            className="btn-blue m-2"
                            onClick={() => setModalShowCrearControl(true)}
                          >
                            Nuevo
                          </button>
                        </div>
                      </div>

                      <div className="form-control_history">
                        <div className="row mb-3">
                          <div className="col-2 sm-2">
                            <label id="textoIntroHistory">IDC:</label>
                          </div>
                          <div className="col-2 sm-2">
                            {idcPaciente}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-2 sm-2">
                            <label id="textoIntroHistory">Nombre:</label>
                          </div>
                          <div className="col-2 sm-4">
                            {apellidoPaciente}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-2 sm-2">
                            <label id="textoIntroHistory">Tratamientos:</label>
                          </div>
                          <div className="col-2 sm-4">
                            <select value={apellidoPaciente} multiple={false} required>
                              <option value="">____________________________</option>
                              {/*TODO actualizar opciones*/}
                            </select>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-2 sm-2">
                            <label id="textoIntroHistory">Pieza:</label>
                          </div>
                          <div className="col-2 sm-4">
                            <select value={apellidoPaciente} multiple={false} required>
                              <option value="">____________________________</option>
                              {/*TODO actualizar opciones*/}
                            </select>
                          </div>
                        </div>
                      </div>

                      <hr></hr>

                      <div className="form-control_history justify-content-center align-content-center">
                        <div className="container">
                          {results.map((control, index) => (
                            <tr key={control.id}>
                              <div className="row mb-2">
                                <div className="col-2 sm-2 d-flex align-items-center">
                                  <label id="textoIntroHistory">Doctor:</label>
                                </div>
                                <div className="col-2 sm-2">
                                  <input type="text" value={control.doctor} disabled style={{ textAlign: "center", backgroundColor: "white", border: "0" }} />
                                </div>
                              </div>

                              <div className="row mb-2">
                                <div className="col-2 sm-2 d-flex align-items-center">
                                  <label id="textoIntroHistory">Fecha:</label>
                                </div>
                                <div className="col-2 sm-2">
                                  <input
                                    type="text"
                                    value={moment(control.fechaControlRealizado).format("DD/MM/YY")}
                                    style={{ textAlign: "center", backgroundColor: "white", border: "0" }}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="row mb-4">
                                <div className="col-2 sm-2">
                                  <label id="textoIntroHistory" style={{ marginTop: "15px" }}>Detalle:</label>
                                </div>
                                <div className="col-10 sm-10">
                                  <textarea
                                    type="text"
                                    value={control.detalleTratamiento}
                                    style={{ textAlign: "justify", height: '150px', width: "150%", backgroundColor: "#e8f0fa" }}
                                    className="form-control m-2"
                                    disabled
                                  />
                                  <div className="col-12 d-flex justify-content-end">
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
                                  </div>
                                </div>
                              </div>
                              <br></br>
                              <br></br>

                            </tr>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )
        }
      </div >
      <CrearControlEvolucion
        id={id.id}
        show={modalShowCrearControl}
        onHide={() => setModalShowCrearControl(false)} />
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