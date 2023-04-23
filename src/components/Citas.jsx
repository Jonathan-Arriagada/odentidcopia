import React from 'react'
import {
    collection,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import { useState, useEffect } from "react";
  import { db } from "../firebaseConfig/firebase";

function Citas() {
    const [citas, setCitas] = useState([]);
    const [search, setSearch] = useState("");
  
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
    <div className="container">
    <div className="row">
      <div className="col">
        <div className="d-grid gap-2">
          <div className="d-flex">
            <h1>Citas</h1>
          </div>
          <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar por Apellido o IDC..."
                  className="form-control m-2"
                />
          <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>IDC</th>
                    <th>Edad</th>
                    <th>Numero</th>
                    <th>Fecha</th>
                    <th>Comentarios</th>
                    <th>Accion</th>
                  </tr>
                </thead>

                <tbody className="table-group-divider table-active">
                  {results.map((cita) => (
                    <tr key={cita.id}>
                      <td> {cita.nombre} </td>
                      <td> {cita.apellido} </td>
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
                        </div>
                        </div>
                        </div>
                        </div>

          </>
  )
}

export default Citas