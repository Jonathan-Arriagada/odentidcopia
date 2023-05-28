import React from "react";
import { collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../../firebaseConfig/firebase";
import { onSnapshot } from "firebase/firestore";
import "../Pacientes/Show.css";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import { Modal, Button } from "react-bootstrap";

function ControlEvolucionEspecif(id) {
  const [apellidoConNombre, setApellidoConNombre] = useState('');
  const [idc, setIdc] = useState('');
  const [tratamientoControl, setTratamientoControl] = useState('');
  const [pieza, setPieza] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fechaTratamiento, setFechaTratamiento] = useState('');
  const [detalleTratamiento, setDetalleTratamiento] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const clearFields = () => {
    setApellidoConNombre('');
    setIdc('');
    setTratamientoControl('');
    setPieza('');
    setDoctor('');
    setFechaTratamiento('');
    setDetalleTratamiento('');
  }

  return (
    <div className="mainpage">
      {isLoading ? (
        <span className="loader position-absolute start-50 top-50 mt-3"></span>
      ) : (
        <>
          <div className="w-100">
            <div className="container mw-100 mt-2">
              <div className="row">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ maxHeight: "40px", marginLeft: "10px" }}
                    >
                      <h3>Control y Evolución</h3>
                    </div>
                  </div>


                  <form className="mt-2" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="d-flex col-md-5">
                        <label className="col-form-label me-5 w-25">Nombre:</label>
                        <input
                          value={apellidoConNombre}
                          onChange={(e) => setApellidoConNombre(e.target.value)}
                          type="text"
                          className="form-control my-1 ms-2 w-100"
                        />
                      </div>
                      <div className="d-flex col-md-5">
                        <label className="col-form-label me-5 w-25">DNI:</label>
                        <input
                          value={idc}
                          onChange={(e) => setIdc(e.target.value)}
                          type="number"
                          className="form-control m-1 w-100"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="d-flex col-md-5">
                        <label className="col-form-label me-5 w-25">Tratamiento:</label>
                        <input
                          value={tratamientoControl}
                          onChange={(e) => setTratamientoControl(e.target.value)}
                          type="text"
                          className="form-control my-1 ms-2 w-100"
                        />
                      </div>
                      <div className="d-flex col-md-5">
                        <label className="col-form-label me-5 w-25">Pieza:</label>
                        <input
                          value={pieza}
                          onChange={(e) => setPieza(e.target.value)}
                          type="number"
                          className="form-control m-1 w-100"
                        />
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex col-md-5">
                      <label className="col-form-label me-5 w-25">Doctor:</label>
                      <input
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        type="text"
                        className="form-control m-1 w-100"
                      />
                    </div>
                    <div className="d-flex col-md-5">
                      <label className="col-form-label me-5 w-25">Fecha:</label>
                      <input
                        value={fechaTratamiento}
                        onChange={(e) => setFechaTratamiento(e.target.value)}
                        type="date"
                        className="form-control m-1 w-100"
                      />
                    </div>
                    <div className="d-flex col-md-5">
                      <label className="col-form-label me-5 w-25">Detalle:</label>
                      <textarea
                        value={detalleTratamiento}
                        onChange={(e) => setDetalleTratamiento(e.target.value)}
                        type="text"
                        className="form-control m-1"
                        style={{ height: '150px' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ margin: '1px' }}
                    >
                      Agregar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}

export default ControlEvolucionEspecif;