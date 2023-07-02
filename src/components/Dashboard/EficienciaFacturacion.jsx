import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function EficienciaFacturacion(props) {
  const [, setTotalPagos] = useState(0);
  const [, setPagados] = useState(0);
  const [porcentajePagados, setPorcentajePagados] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "tratamientos"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let pagados = 0;

      snapshot.forEach((doc) => {
        const tratamiento = doc.data();
        total++;

        if (tratamiento.estadoPago === "Cancelado") {
          pagados++;
        }
      });

      setTotalPagos(total);
      setPagados(pagados);
      calcularPorcentaje(pagados, total);
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  const calcularPorcentaje = (pagados, total) => {
    if (total > 0) {
      const porcentaje = (pagados / total) * 100;
      setPorcentajePagados(porcentaje.toFixed(0));
    } else {
      setPorcentajePagados(0);
    }
  };

  return (
    <div>
      <span>{porcentajePagados}%</span>
    </div>
  );
}

export default EficienciaFacturacion;