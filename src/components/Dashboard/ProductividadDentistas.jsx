import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import profile from "../../img/profile.png";

const ProductividadDentistas = (props) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "controlEvoluciones"),
      where("fechaControlRealizado", ">=", props.fechaInicio),
      where("fechaControlRealizado", "<=", props.fechaFin)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const doctores = {};

      querySnapshot.docChanges().forEach((change) => {
        const doctor = change.doc.data().doctor;
        doctores[doctor] = (doctores[doctor] || 0) + 1;
      });

      const datosDoctores = await Promise.all(
        Object.entries(doctores).map(async ([doctor, pacientes]) => {
          const busqueda = query(collection(db, "user"), where("nombreCompleto", "==", doctor));
          const querySnapshot = await getDocs(busqueda);

          let foto = profile;
          if (!querySnapshot.empty) {
            const doctorSnapshot = querySnapshot.docs[0];
            foto = doctorSnapshot.data()?.foto || profile;
          }

          return { doctor, pacientes, foto };
        })
      );

      setDatos(datosDoctores);
    });

    return unsubscribe;
  }, [props]);

  return (
    <table className="table__body-dash">
      <thead>
        <tr></tr>
      </thead>
      <tbody>
        {datos.map((dato, index) => (
          <tr key={index}>
            <td className="fila-dash text-start">
              <img
                className="iconosDash rounded-circle"
                src={dato.foto}
                alt="fotoDoctor"
                loading="lazy"
              />
            </td>
            <td className="fila-dash text-start">{dato.doctor}</td>
            <td className="fila-dash text-end">{dato.pacientes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductividadDentistas;