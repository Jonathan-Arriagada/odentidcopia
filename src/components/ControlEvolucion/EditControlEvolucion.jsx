import React, { useState, useContext } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext"

const Edit = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState(props.control.apellidoConNombre || '');
  const [idc, setIdc] = useState(props.control.idc || '');
  const [tratamientoControl, setTratamientoControl] = useState(props.control.tratamientoControl || '');
  const [pieza, setPieza] = useState(props.control.pieza || '');
  const [fechaControlRealizado, setFechaControlRealizado] = useState(props.control.fechaControlRealizado || '');
  const [detalleTratamiento, setDetalleTratamiento] = useState(props.control.detalleTratamiento || '');
  const { currentUser } = useContext(AuthContext);


  const update = async (e) => {
    e.preventDefault();
    const controlRef = doc(db, "controlEvoluciones", props.id);
    const controlDoc = await getDoc(controlRef);
    const controlData = controlDoc.data();

    const newData = {
      apellidoConNombre: apellidoConNombre || controlData.apellidoConNombre,
      idc: idc || controlData.idc,
      tratamientoControl: tratamientoControl || controlData.tratamientoControl,
      pieza: pieza || controlData.pieza,
      doctor: currentUser.displayName,
      fechaControlRealizado: fechaControlRealizado || controlData.fechaControlRealizado,
      detalleTratamiento: detalleTratamiento || controlData.detalleTratamiento,
    };
    await updateDoc(controlRef, newData);
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
          <h1>Editar Control</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <br></br>
                <div className="row">
                  <div className="col mb-6">
                    <label className="form-label">Apellido y Nombres:</label>
                    <input
                      defaultValue={props.control.apellidoConNombre}
                      onChange={(e) => setApellidoConNombre(e.target.value)}
                      type="text"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col mb-6">
                    <label className="form-label">DNI:</label>
                    <input
                      defaultValue={props.control.idc}
                      onChange={(e) => setIdc(e.target.value)}
                      type="number"
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-6">
                    <label className="form-label">Tratamiento:</label>
                    <input
                      defaultValue={props.control.tratamientoControl}
                      onChange={(e) => {
                        setTratamientoControl(e.target.value)
                      }}
                      className="form-control"
                      disabled
                    >
                    </input>
                  </div>
                  <div className="col mb-6">
                    <label className="form-label">Pieza:</label>
                    <input
                      defaultValue={props.control.pieza}
                      onChange={(e) => setPieza(e.target.value)}
                      type="number"
                      className="form-control m-1 w-100"
                      disabled
                    />
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="d-flex col-md-8">
                    <label className="col-form-label me-5 w-25">Doctor:</label>
                    <input
                      value={currentUser.displayName}
                      type="text"
                      className="form-control m-1 w-100"
                      disabled
                    />
                  </div>
                  <div className="d-flex col-md-8">
                    <label className="col-form-label me-5 w-25">Fecha:</label>
                    <input
                      defaultValue={props.control.fechaControlRealizado}
                      onChange={(e) => setFechaControlRealizado(e.target.value)}
                      type="date"
                      className="form-control m-1 w-100"
                    />
                  </div>
                  <div className="d-flex col-md-8">
                    <label className="col-form-label me-5 w-25">Detalle:</label>
                    <textarea
                      defaultValue={props.control.detalleTratamiento}
                      onChange={(e) => setDetalleTratamiento(e.target.value)}
                      type="text"
                      className="form-control m-1"
                      style={{ height: '150px' }}
                    />
                  </div>
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