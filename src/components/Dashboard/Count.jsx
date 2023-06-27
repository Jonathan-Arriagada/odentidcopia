import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import moment from "moment";

function Count() {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [contadorClientes, setContadorClientes] = useState({});

  useEffect(() => {
    const q = query(collection(db, "clients"), where("fechaAlta", "==", hoy));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientes = [];
      snapshot.forEach((doc) => {
        const cliente = doc.data();
        cliente.id = doc.id;
        clientes.push(cliente);
      });
      const contador = countClientesNuevosPorDia(clientes);
      setContadorClientes(contador);
    });

    return () => {
      unsubscribe();
    };
  }, [hoy]);

  const countClientesNuevosPorDia = (clientes) => {
    const contador = {};

    clientes.forEach((cliente) => {
      const fechaCliente = moment(cliente.fechaAlta, "YYYY-MM-DD").startOf("day");
      const fechaKey = fechaCliente.format();
      contador[fechaKey] = contador[fechaKey] ? contador[fechaKey] + 1 : 1;
    });

    return contador;
  };

  const mostrarContador = Object.entries(contadorClientes).map(([fecha, contador]) => (
    <span key={fecha}>{contador}</span>
  ));

  return (
    <div>
      {Object.keys(contadorClientes).length > 0 ? mostrarContador : <span>0</span>}
    </div>
  );
}

export default Count;