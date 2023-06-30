import React from "react";

const ProductividadDentistas = () => {
  const datos = [
    { doctor: "Dr. Ivan Vazquez", pacientes: 10 },
    { doctor: "Dra. María López", pacientes: 8 },
    { doctor: "Dr. Jonathan Arriagada", pacientes: 12 },
    // Agrega más datos de doctores y pacientes aquí según sea necesario
  ];
  return (
    <div className="table__container">
      <table className="table__body">
        <thead>
          <tr>
            <th className="text-start">Doctor</th>
            <th>Pacientes</th>
          </tr>
        </thead>

        <tbody>
          {datos.map((dato, index) => (
            <tr key={index}>
              <td className="text-start">{dato.doctor}</td>
              <td>{dato.pacientes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductividadDentistas;
