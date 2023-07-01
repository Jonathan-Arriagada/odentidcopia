import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";

import moment from "moment";
import "../../../style/Main.css";

const InformeIngresos = () => {
  const [gastos, setGastos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const gastosCollectiona = collection(db, "gastos");
  const gastosCollection = useRef(
    query(gastosCollectiona, orderBy("timestamp", "desc"))
  );

  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [userType, setUserType] = useState("");
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre", "Noviembre", "Diciembre"];

  const getGastos = useCallback((snapshot) => {
    const gastosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setGastos(gastosArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const type = localStorage.getItem("rol");
    setUserType(type);

    const unsubscribe = onSnapshot(gastosCollection.current, getGastos);
    return unsubscribe;
  }, [getGastos]);



  function quitarAcentos(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }


  function funcMostrarAjustes() {
    if (mostrarAjustes) {
      setMostrarAjustes(false);
    } else {
      setMostrarAjustes(true);
    }
  }

  return (
    <>
      {isLoading ? (
        <span className="loader position-absolute start-50 top-50 mt-3"></span>
      ) : (
          <div className="container mw-100">
            <div className="row">
              <div className="col">
                <br></br>
                <div className="d-flex justify-content-between">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ maxHeight: "40px", marginLeft: "10px" }}
                  >
                    <h1>Informe ingresos</h1>
                    {userType === process.env.REACT_APP_rolAdCon ? (
                      <button
                        className="btn grey mx-2 btn-sm"
                        style={{ borderRadius: "5px" }}
                        onClick={() => {
                          funcMostrarAjustes(true);
                        }}
                      >
                        <i className="fa-solid fa-gear"></i>
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="table__container">
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        <th>2023</th>
                        <th>2024</th>
                        <th>2025</th>
                        <th>2026</th>
                        <th>2027</th>
                        <th>2028</th>
                      </tr>
                    </thead>

                    <tbody>
                    {meses.map((mes, index) => (
                        <tr key={index}>
                            <td>{mes}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        ))}
                        <tr>
                            <td>Total</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default InformeIngresos;
