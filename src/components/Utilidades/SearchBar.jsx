import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import './SearchBar.css';
import Autosuggest from 'react-autosuggest';


const SearchBar = ({ onValorSeleccionado }) => {
  const dataa = query(collection(db, 'clients')); 
  const data = useRef(query(dataa, orderBy("valorBusqueda")));
  const [clientes, setClientes] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [renderSuggestions, setRenderSuggestions] = useState(false);


  //UseEffect optimizado
  const updateClientesFromSnapshot = useCallback((snapshot) => {
    const newClientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClientes(newClientes);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(data.current, updateClientesFromSnapshot);
    return unsubscribe;
  }, [updateClientesFromSnapshot]);
 
 //Filtrador
  const filtrarValores = (value) => {
    const inputValue = value.trim().toLowerCase();

    const filtrado = clientes.filter((obj) => {
      const textoCompleto = obj.valorBusqueda.toLowerCase();

      if (textoCompleto && textoCompleto.includes(inputValue)) {
        return true;
      } else {
        return false;
      }
    });

    return filtrado;
  };

  //Cuatro Funciones del Autosuggest
  const onSuggestionsFetchRequested = ({ value }) => {
      const filteredValues = filtrarValores(value);
      setSuggestions(filteredValues);
    
  }
  const onSuggestionsClearRequested = () => {
    setRenderSuggestions(false);
    setSuggestions(clientes);
  }
  const getSuggestionValue = (suggestion) => {
    setRenderSuggestions(false);
    return `${suggestion.valorBusqueda}`;
  }
  const renderSuggestion = (suggestion) => {
    return (
      <div className='sugerencia' onClick={() => {
        seleccionarValor(suggestion);
        setRenderSuggestions(false);
      }}>
        {`${suggestion.valorBusqueda}`}
      </div>
    );
  }

  //Pasa atributos a componente padre
  const seleccionarValor = (suggestion) => {
    setRenderSuggestions(false);
    const apellidoConNombre = suggestion.apellidoConNombre;
    const idc = suggestion.idc;
    onValorSeleccionado(apellidoConNombre, idc);
  }

  const todasLasSugerencias = () => {
    setSuggestions(clientes);
    setRenderSuggestions(true);
  };


  return (
    <div className='SearchBar'>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        alwaysRenderSuggestions={renderSuggestions}

        inputProps={{
          placeholder: "Buscar paciente...",
          value,
          onChange: (e, { newValue }) => {
            setValue(newValue);
          },
          onClick: todasLasSugerencias,
        }
        }
      />
    </div>
  );
};

export default SearchBar;