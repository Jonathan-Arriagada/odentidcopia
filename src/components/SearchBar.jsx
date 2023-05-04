import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import './SearchBar.css';
import Autosuggest from 'react-autosuggest';


const SearchBar = ({ onValorSeleccionado }) => {
  const dataa = query(collection(db, 'clients')); 
  const data = useRef(query(dataa, orderBy("valorBusqueda")));
  const [clientes, setClientes] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //UseEffect optimizado
  const updateClientesFromSnapshot = useCallback((snapshot) => {
    const newClientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClientes(newClientes);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(data.current, updateClientesFromSnapshot);
    return unsubscribe;
  }, [updateClientesFromSnapshot]);
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig/firebase';

const SearchBar = ({ setClients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const clientsRefa = collection(db, "clients");
  const clientsRef = useRef(query(clientsRefa, where('valorBusqueda', '>=', searchTerm), where('valorBusqueda', '<=', searchTerm + '\uf8ff'), orderBy("valorBusqueda")));

  const handleSearch = useCallback(() => {
    const unsubscribe = onSnapshot(clientsRef.current, (querySnapshot) => {
      const clients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clients);
    });
    return unsubscribe; 
  }, [setClients]);

  useEffect(() => {
    const unsubscribe = handleSearch();
    return () => unsubscribe();
  }, [handleSearch]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Buscar por apellido, nombre o IDC"
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};
 

 //Filtrador
  const filtrarValores = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const filtrado = clientes.filter((obj) => {
      const textoCompleto = obj.valorBusqueda.toLowerCase();

      if (textoCompleto && textoCompleto.includes(inputValue)) {
        return true;
      } else {
        return false;
      }
    });

    return inputLength === 0 ? [] : filtrado;
  };

  //Cuatro Funciones del Autosuggest
  const onSuggestionsFetchRequested = ({ value }) => {
    if (value && value.length > 0) {
      const filteredValues = filtrarValores(value);
      console.log(filteredValues)
      setSuggestions(filteredValues);
    }
  }
  const onSuggestionsClearRequested = () => {
    setSuggestions(clientes);
  }
  const getSuggestionValue = (suggestion) => {
    return `${suggestion.valorBusqueda}`;
  }
  const renderSuggestion = (suggestion) => {
    return (
      <div className='sugerencia' onClick={() => seleccionarValor(suggestion)}>
        {`${suggestion.valorBusqueda}`}
      </div>
    );
  }

  //Pasa atributos a componente padre
  const seleccionarValor = (suggestion) => {
    const apellido = suggestion.apellido;
    const nombre = suggestion.nombre;
    const idc = suggestion.idc;
    onValorSeleccionado(apellido, nombre, idc);
  }

  const todasLasSugerencias = () => {
    setSuggestions(clientes);
  };


  return (
    <div className='SearchBar'>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Buscar paciente...",
          value,
          onChange: (e, { newValue }) => {
            setValue(newValue);
          },
          onClick: todasLasSugerencias
        }
        }
      />
    </div>
  );
};

export default SearchBar;
export default SearchBar;