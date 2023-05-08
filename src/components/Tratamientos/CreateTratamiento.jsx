import React, { useState, useCallback, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";


function CreateTratamiento(props) {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [cant, setCant] = useState("");
  const [cta, setCta] = useState("");
  const [precio, setPrecio] = useState("");
  const [tarifasTratamientos, setTarifasTratamientos] = useState("");
  const [pieza, setPieza] = useState("");
  const [plazo, setPlazo] = useState("");
  const [cuota, setCuota] = useState("");
  const [estadosTratamientos, setEstadosTratamientos] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");

  const [estadoOptionsTratamientos, setEstadoOptionsTratamientos] = useState([]);
  const [optionsTarifasTratamientos, setOptionsTarifasTratamientos] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);


  const [editable, setEditable] = useState(true);


  const tratamientosCollection = collection(db, "tratamientos");

  const updateOptionsEstadosTratamientos = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().name);
    setEstadoOptionsTratamientos(options);
  }, []);

  const updateOptionsPacientes = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().valorBusqueda);
    options.unshift("<---Ingreso manual--->");
    setValorBusquedaOptions(options);
  }, []);

  //Render:
  const estadoOptionsTratamientosJSX = estadoOptionsTratamientos.map((option, index) => (
    <option key={`estado-${index}`} value={option}>{option}</option>
  ));
  const valorBusquedaOptionsJSX = valorBusquedaOptions.map((option, index) => (
    <option key={`valorBusqueda-${index}`} value={option}>{option}</option>
  ));

  const updateOptionsTarifasTratamientos = useCallback(snapshot => {
    const options2 = snapshot.docs.map(doc => (
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.tarifasTratamientos}>{doc.data().tratamiento}</option>
    ));
    setOptionsTarifasTratamientos(options2);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOptionsPacientes),
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
      onSnapshot(query(collection(db, "tarifas"), orderBy("eliminado"), where("eliminado", "!=", true)), updateOptionsTarifasTratamientos),
    ];
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsPacientes, updateOptionsEstadosTratamientos, updateOptionsTarifasTratamientos]);

  const store = async (e) => {
    e.preventDefault();
    await addDoc(tratamientosCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      cant: cant,
      cta: cta,
      precio: precio,
      tarifasTratamientos: tarifasTratamientos,
      pieza: pieza,
      plazo: plazo,
      cuota: cuota,
      estadosTratamientos: estadosTratamientos,
      fecha: fecha,
      fechaVencimiento: fechaVencimiento,
      notas: notas,
    });
  };

  async function buscarTratamiento(tratamiento) {
    const q = query(collection(db, "tarifas"), where("tratamiento", "==", tratamiento));
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      setCta(querySnapshot.docs[0].data().codigo);
      setPrecio(querySnapshot.docs[0].data().tarifa);
    } else {
      setCta("");
      setPrecio("");
    }
  }


  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "<---Ingreso manual--->" || suggestion === "") {
      setApellidoConNombre("");
      setIdc("");
      setEditable(true);
      return;
    }

    const querySnapshot = await getDocs(
      query(collection(db, "clients"), where("valorBusqueda", "==", suggestion))
    );

    const doc = querySnapshot.docs[0];

    if (doc) {
      const data = doc.data();
      setApellidoConNombre(data.apellidoConNombre);
      setIdc(data.idc);
      setEditable(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => {
        props.onHide();
        setApellidoConNombre("");
        setIdc("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <div className="col mb-3" style={{ background: "#23C9FF", padding: "6px", borderRadius: "20px" }}>
              <label className="form-label" style={{ marginLeft: "15px", fontWeight: "bold" }}>Buscador por Apellido, Nombre o Idc:</label>
              <input
                style={{ borderRadius: "100px" }}
                type="text"
                className="form-control"
                onChangeCapture={(e) => manejarValorSeleccionado(e.target.value)}
                list="pacientes-list"
                multiple={false}
              />
              <datalist id="pacientes-list">
                <option value="">Ingreso manual</option>
                {valorBusquedaOptionsJSX}
              </datalist>
            </div>
          </div>

          <form onSubmit={store}>
            <div className="row">
              <div className="col mb-3">
                <label className="form-label">Apellido y Nombres</label>
                <input
                  value={apellidoConNombre}
                  onChange={(e) => setApellidoConNombre(e.target.value)}
                  type="text"
                  className="form-control"
                  disabled={!editable}
                />
              </div>
              <div className="col mb-3">
                <label className="form-label">IDC</label>
                <input
                  value={idc}
                  onChange={(e) => setIdc(e.target.value)}
                  type="number"
                  className="form-control"
                  disabled={!editable}
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-3">
                <label className="form-label">Tratamiento</label>
                <select
                  value={tarifasTratamientos}
                  onChange={(e) => {
                    setTarifasTratamientos(e.target.value)
                    buscarTratamiento(e.target.value)
                  }}
                  className="form-control"
                  multiple={false}
                >
                  <option value="">Selecciona un Tratamiento</option>
                  {optionsTarifasTratamientos}
                </select>
              </div>
              <div className="col mb-3">
                <label className="form-label">Estado del Tratamiento</label>
                <select
                  value={estadosTratamientos}
                  onChange={(e) => setEstadosTratamientos(e.target.value)}
                  className="form-control"
                  multiple={false}
                >
                  <option value="">Selecciona un estado</option>
                  {estadoOptionsTratamientosJSX}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col mb-">
                <label className="form-label">Cta</label>
                <input
                  value={cta}
                  type="number"
                  className="form-control"
                  disabled={true}
                />
              </div>
              <div className="col mb-2">
                <label className="form-label">Precio</label>
                <input
                  value={precio}
                  type="number"
                  className="form-control"
                  disabled={true}
                />
              </div>
            </div>

            <div className="row">
              <div className="col sm-2">
                <label className="form-label">Pieza</label>
                <input
                  value={pieza}
                  onChange={(e) => setPieza(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>
              <div className="col mb-2">
                <label className="form-label">Cant</label>
                <input
                  value={cant}
                  onChange={(e) => setCant(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>
              <div className="col sm-2">
                <label className="form-label">Plazo</label>
                <input
                  value={plazo}
                  onChange={(e) => setPlazo(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>
              <div className="col sm-2">
                <label className="form-label">Cuota</label>
                <input
                  value={cuota}
                  onChange={(e) => setCuota(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col sm-3">
                <label className="form-label">Fecha</label>
                <input
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  type="date"
                  className="form-control"
                />
              </div>
              <div className="col sm-3">
                <label className="form-label">Fecha Vencimiento</label>
                <input
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  type="date"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-3">
                <label className="form-label">Notas</label>
                <input
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <button type="submit" onClick={props.onHide} className="btn btn-primary" style={{ margin: '1px' }}>Agregar</button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateTratamiento;