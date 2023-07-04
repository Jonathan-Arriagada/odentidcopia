import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const ProductividadDentistas = (props) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "controlEvoluciones"),
      where("fechaControlRealizado", ">=", props.fechaInicio),
      where("fechaControlRealizado", "<=", props.fechaFin)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const doctores = {};

      querySnapshot.forEach((doc) => {
        const doctor = doc.data().doctor;
        if (doctores[doctor]) {
          doctores[doctor] += 1;
        } else {
          doctores[doctor] = 1;
        }
      });

      const datosDoctores = Object.entries(doctores).map(([doctor, pacientes]) => ({ doctor, pacientes }));
      setDatos(datosDoctores);
    });

    return unsubscribe;
  }, [props]);


  return (
    <table className="table__body-dash">
      <thead>
        <tr>
        </tr>
      </thead>

      <tbody>
        {datos.map((dato, index) => (
          <tr key={index}>
            <td className="fila-dash text-start">{dato.doctor}</td>
            <td className="fila-dash text-end">{dato.pacientes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductividadDentistas;
