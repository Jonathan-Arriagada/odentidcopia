import React from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase";
import CreateCita from "./CreateCita";
import Navigation from "./Navigation";
import "./Show.css";
function Citas() {
  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowCita, setModalShowCita] = React.useState(false);

  const citasCollection = collection(db, "citas");

  const getCitas = async () => {
    const data = await getDocs(citasCollection);
    setCitas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteCita = async (id) => {
    const citaDoc = doc(db, "citas", id);
    await deleteDoc(citaDoc);
    getCitas();
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  if (!search) {
    results = citas;
  } else {
    results = citas.filter(
      (dato) =>
        dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    );
  }

  useEffect(() => {
    getCitas();
  }, []);

  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-grid gap-2">
                <div className="d-flex">
                  <h1>Agenda</h1>
                </div>
                <div className="d-flex justify-content-end">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido o IDC..."
                    className="form-control m-2 w-25"
                  />
                  <button
                    variant="primary"
                    className="btn-blue m-2"
                    onClick={() => setModalShowCita(true)}
                  >
                    Agregar Cita
                  </button>
                </div>
                </div>
                <section className="table__body">
                  <table>
                    <thead>
                      <tr>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>IDC</th>
                        <th>Edad</th>
                        <th>Numero</th>
                        <th>Fecha</th>
                        <th>Comentarios</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((cita) => (
                        <tr key={cita.id}>
                          <td> {cita.apellido} </td>
                          <td> {cita.nombre} </td>
                          <td> {cita.idc} </td>
                          <td> {cita.edad} </td>
                          <td> {cita.numero} </td>
                          <td> {cita.fecha} </td>
                          <td> {cita.comentario} </td>
                          <td>
                            <button
                              onClick={() => {
                                deleteCita(cita.id);
                              }}
                              className="btn btn-danger"
                            >
                              {" "}
                              <i className="fa-solid fa-trash-can"></i>{" "}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </div>
      <CreateCita show={modalShowCita} onHide={() => setModalShowCita(false)} />
    </>
  );
}

export default Citas;
