import React, { useState, } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import peruFlag from "../../img/peru.png"
import argentinaFlag from "../../img/argentina.png"
import moment from "moment";

const Create = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [tipoIdc, setTipoIdc] = useState("dni");
  const [idc, setIdc] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [numero, setNumero] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [error, setError] = useState("");
  const [selectedCode, setSelectedCode] = useState("+51");

  const clientsCollection = collection(db, "clients");

  const confirm = () => {
    Swal.fire({
      title: '¡Paciente agregado!',
      icon: 'success',
    })
  }

  const validateFields = async (e) => {
    e.preventDefault();
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      fechaNacimiento.trim() === "" ||
      numero.trim() === ""
    ) {
      setError("Todos los campos son obligatorios");
      setTimeout(clearError, 2000)
      return false;
    } else {
      const querySnapshot = await getDocs(query(clientsCollection, where("idc", "==", idc)));
      if (!querySnapshot.empty) {
        setError("El IDC ya existe en la Base de Datos");
        setTimeout(clearError, 2000)
        return false;
      } else {
        setError("");
        await store();
        clearFields();
        props.onHide();
        confirm();
      }
    }
    return true;
  };

  const clearError = () => {
    setError("");
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setTipoIdc("dni");
    setIdc("");
    setFechaNacimiento("");
    setEdad("");
    setNumero("");
    setError("");
    setSelectedCode("+51");
  };

  const handleFechaNac = (event) => {
    const { value } = event.target;
    const edad = moment().diff(moment(value), "years");
    setFechaNacimiento(value);
    setEdad(edad)
  };

  const store = async () => {
    await addDoc(clientsCollection, {
      apellidoConNombre: apellidoConNombre,
      tipoIdc: tipoIdc,
      idc: idc,
      fechaNacimiento: fechaNacimiento,
      selectedCode: selectedCode,
      numero: numero,
      valorBusqueda: valorBusqueda,
      edad: edad,
      sexo: "",
      lugarNacimiento: "",
      procedencia: "",
      direccion: "",
      ocupacion: "",
      correo: "",
      responsable: "",
      nombreResponsable: "",
      telefonoResponsable: "",
      pregunta1: ["", false],
      pregunta2: ["", false],
      pregunta3: ["", false],
      pregunta4: ["", false],
      pregunta5: ["", false],
      pregunta6: ["", false],
      pregunta7: ["", false],
      pregunta8: ["", false],
      pregunta9: ["", false],
      pregunta10: ["", false],
      pregunta11: ["", false],
      pregunta12: ["", false],
      pregunta13: ["", false],
      pregunta14: ["", false],
      pregunta15: ["", false],
      pregunta16: ["", false],
      pregunta17: ["", false],
      pregunta18: ["", false],
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => { clearFields(); props.onHide(); }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Paciente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
            <form style={{ transform: "scale(0.96)" }}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">IDC*</label>
                  <div style={{ display: "flex" }}>
                    <select
                      value={tipoIdc}
                      onChange={(e) => { setTipoIdc(e.target.value); setIdc("") }}
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
                      value={idc}
                      onChange={(e) => {
                        setIdc(e.target.value);
                        setValorBusqueda(apellidoConNombre + " " + e.target.value);
                      }}
                      type={tipoIdc === "dni" || tipoIdc === "ruc" ? "number" : "text"}
                      minLength={tipoIdc === "dni" ? 8 : undefined}
                      maxLength={tipoIdc === "dni" ? 8 : tipoIdc === "ruc" ? 11 : tipoIdc === "ce" || tipoIdc === "pas" ? 12 : undefined}
                      onKeyDown={(e) => {
                        const maxLength = e.target.maxLength;
                        const currentValue = e.target.value;
                        const isTabKey = e.key === "Tab";
                        if (maxLength && currentValue.length >= maxLength && !isTabKey) {
                          e.preventDefault();
                        }
                      }}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
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
                  <label className="form-label">Fecha Nacimiento*</label>
                  <input
                    value={fechaNacimiento}
                    onChange={handleFechaNac}
                    type="date"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono*</label>
                  <div style={{ display: "flex" }}>
                    <img src={selectedCode === '+51' ? peruFlag : argentinaFlag} alt="Flag" style={{ width: '45px', marginRight: '4px' }} />
                    <select
                      value={selectedCode}
                      onChange={(e) => { setSelectedCode(e.target.value); setNumero("") }}
                      className="form-control-tipoIDC me-1"
                      multiple={false}
                      style={{ width: "fit-content" }}
                      required
                    >
                      <option value="+51">+51</option>
                      <option value="+54">+54</option>
                    </select>
                    <input
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      type="number"
                      className="form-control"
                      required
                    />
                  </div>
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
