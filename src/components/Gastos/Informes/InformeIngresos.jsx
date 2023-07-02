import React, { useState, useEffect } from "react";
import "../../../style/Main.css";

const InformeIngresos = () => {

  const [isLoading, setIsLoading] = useState(true);
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {

  });


  return (
    <>
      <div className="container mw-100">
        <div className="row">
          <div className="col">
            <br></br>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ maxHeight: "40px", marginLeft: "10px" }}
              >
                <h1>Informe Ingresos</h1>
              </div>
            </div>

            <div className="table__container w-50 ">
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
    </>
  );
};

export default InformeIngresos;
