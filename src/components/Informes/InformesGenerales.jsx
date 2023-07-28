import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect, useRef } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import ComparacionAnual from "./ComparacionAnual";
import ComparacionMensual from "./ComparacionMensual";
import InformeCompras from "./InformeCompras";
import InformeIngresos from "./InformeIngresos";
import InformeIngresosPorServicio from "./InformeIngresosPorServicio";
import Resultados from "./Resultados";
import "../../style/Main.css";
import moment from "moment";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function InformesGenerales() {
  const [value, setValue] = useState(0);
  const [isLoading,] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [optionsAñoTratamientos, setOptionsAñoTratamientos] = useState([]);
  const [optionsAñoGastos, setOptionsAñoGastos] = useState([]);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona));
  const gastosCollectiona = collection(db, "gastos");
  const gastosCollection = useRef(query(gastosCollectiona));

  const getDataDeColeccion = async (collectionRef) => {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  useEffect(() => {
    Promise.all([
      getDataDeColeccion(tratamientosCollection.current),
      getDataDeColeccion(gastosCollection.current),
    ]).then(([tratamientosArray, gastosArray]) => {
      setTratamientos(tratamientosArray);
      setGastos(gastosArray);

      const tratamientosOptions = getOptionsAño(tratamientosArray, 'fecha');
      setOptionsAñoTratamientos(tratamientosOptions);
  
      const gastosOptions = getOptionsAño(gastosArray, 'fechaGasto');
      setOptionsAñoGastos(gastosOptions);
    });

  }, []);

  const getOptionsAño = (coleccion, campo) => {
    const valoresUnicos = new Set();

    coleccion.forEach((item) => {
      const fecha = moment(item[campo], "YYYY-MM-DD");
      const año = fecha.year();
      valoresUnicos.add(año);
    });

    const options = Array.from(valoresUnicos)
      .sort((a, b) => b - a)
      .map((año) => (
        <option key={`año-${año}`} value={año}>
          {año}
        </option>
      ));

    return options;
  };


  const handleChange = (_, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      {isLoading ? (
        <div className="w-100">
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        </div>
      ) : (
        <div className="w-100">
          <Box className="container mw-100" sx={{ width: "100%" }} >
            <h1>Informes Contables</h1>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} >
                <Tab label="Informe Compras" />
                <Tab label="Informe Ingresos" />
                <Tab label="Informe Ingresos Por Servicio" />
                <Tab label="Comparacion Mensual" />
                <Tab label="Comparacion Anual" />
                <Tab label="Resultados" />

              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <InformeCompras gastos={gastos} />
            </TabPanel >

            < TabPanel value={value} index={1} >
              <InformeIngresos tratamientos={tratamientos} />
            </TabPanel >

            < TabPanel value={value} index={2} >
              <InformeIngresosPorServicio tratamientos={tratamientos} optionsAño2={optionsAñoTratamientos}/>
            </TabPanel >

            < TabPanel value={value} index={3} >
              <ComparacionMensual gastos={gastos}  optionsAño={optionsAñoGastos}/>
            </TabPanel >

            < TabPanel value={value} index={4} >
              <ComparacionAnual gastos={gastos} optionsAño={optionsAñoGastos} />
            </TabPanel >

            < TabPanel value={value} index={5} >
              <Resultados gastos={gastos} tratamientos={tratamientos}  optionsAño={optionsAñoGastos} />
            </TabPanel >

          </Box >
        </div>
      )};
    </>
  );
}
