import React, { useState } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import peruFlag from "../../img/peru.png";

const Edit = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState(
    props.client.apellidoConNombre || ""
  );
  const [tipoIdc, setTipoIdc] = useState(props.client.tipoIdc || "");
  const [idc, setIdc] = useState(props.client.idc || "");
  const [edad, setEdad] = useState(props.client.edad || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(
    props.client.fechaNacimiento || ""
  );
  const [numero, setNumero] = useState(props.client.numero || "");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [selectedCode, setSelectedCode] = useState(props.client.selectedCode || "");
  const [codigoArea, setCodigoArea] = useState(props.client.selectedCode || "");

  const handleFechaNac = (event) => {
    const { value } = event.target;
    const edad = moment().diff(moment(value), "years");
    setFechaNacimiento(value);
    setEdad(edad);
  };

  const update = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Desea guardar los cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#00C5C1",
      denyButtonText: `No guardar`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const clientRef = doc(db, "clients", props.id);
        const clientDoc = await getDoc(clientRef);
        const clientData = clientDoc.data();

        const newData = {
          apellidoConNombre: apellidoConNombre || clientData.apellidoConNombre,
          tipoIdc: tipoIdc || clientData.tipoIdc,
          idc: idc || clientData.idc,
          fechaNacimiento: fechaNacimiento || clientData.fechaNacimiento,
          edad: edad || clientData.edad,
          selectedCode: selectedCode || clientData.selectedCode || codigoArea,
          numero: numero || clientData.numero,
          valorBusqueda: valorBusqueda || clientData.valorBusqueda,
        };

        Swal.fire("¡Guardado!", "", "success");

        await updateDoc(clientRef, newData);
        clearFields();
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados.", "", "info");
      }
    });
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setTipoIdc("");
    setIdc("");
    setFechaNacimiento("");
    setEdad("");
    setNumero("");
    setValorBusqueda("");
    setSelectedCode("");
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
              <form onSubmit={update} style={{ transform: "scale(0.96)" }}>
                <div className="mb-3">
                  <label className="form-label">IDC*</label>
                  <div style={{ display: "flex" }}>
                    <select
                      value={tipoIdc}
                      onChange={(e) => {
                        setTipoIdc(e.target.value);
                        setIdc("");
                      }}
                      className="form-control-tipoIDC"
                      multiple={false}
                      style={{ width: "fit-content" }}
                      required
                    >
                      <option value="dni">DNI</option>
                      <option value="ce">CE</option>
                      <option value="ruc">RUC</option>
                      <option value="pas">PAS</option>
                    </select>
                    <input
                      defaultValue={props.client.idc}
                      onChange={(e) => {
                        setIdc(e.target.value);
                        setValorBusqueda(
                          (apellidoConNombre ||
                            props.client.apellidoConNombre) +
                          " " +
                          e.target.value
                        );
                      }}
                      type={
                        tipoIdc === "dni" || tipoIdc === "ruc"
                          ? "number"
                          : "text"
                      }
                      minLength={tipoIdc === "dni" ? 8 : undefined}
                      maxLength={
                        tipoIdc === "dni"
                          ? 8
                          : tipoIdc === "ruc"
                            ? 11
                            : tipoIdc === "ce" || tipoIdc === "pas"
                              ? 12
                              : undefined
                      }
                      onKeyDown={(e) => {
                        const maxLength = e.target.maxLength;
                        const currentValue = e.target.value;
                        const isTabKey = e.key === "Tab";
                        const isDeleteKey =
                          e.key === "Delete" ||
                          e.key === "Supr" ||
                          e.key === "Backspace";
                        if (
                          maxLength &&
                          currentValue.length >= maxLength &&
                          !isTabKey &&
                          !isDeleteKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    defaultValue={props.client.apellidoConNombre}
                    onChange={(e) => {
                      setApellidoConNombre(e.target.value);
                      setValorBusqueda(
                        e.target.value + " " + (idc || props.client.idc)
                      );
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha Nacimiento</label>
                  <input
                    defaultValue={props.client.fechaNacimiento}
                    onChange={handleFechaNac}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono</label>
                  <div style={{ display: "flex" }}>
                    {selectedCode === "+51" && (<img
                      src={selectedCode === "+51" ? peruFlag : ""}
                      alt=""
                      style={{ width: "45px", marginRight: "4px" }}
                    />)}
                    <select
                      defaultValue={selectedCode}
                      onChange={(e) => {
                        setSelectedCode(e.target.value);
                        setNumero("");
                      }}
                      className="form-control-tipoIDC me-1"
                      style={{ width: "fit-content" }}
                      required
                    >
                      <option value="+51">+51</option>
                      <option value="">Otro pais</option>
                    </select>
                    {selectedCode === "+51" ? (
                      <input
                        value={props.client.numero}
                        onChange={(e) => setNumero(e.target.value)}
                        type="number"
                        className="form-control"
                        required
                      />
                    ) : (
                      <>
                        <input
                          defaultValue={props.client.selectedCode}
                          onChange={(e) => setCodigoArea(e.target.value)}
                          type="text"
                          className="form-control me-2"
                          style={{ width: "100px" }}
                          placeholder="Cod. area"
                        />
                        <input
                          defaultValue={props.client.numero}
                          onChange={(e) => setNumero(e.target.value)}
                          type="text"
                          className="form-control"
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    props.onHide();
                    setSelectedCode(codigoArea || props.client.selectedCode)
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
