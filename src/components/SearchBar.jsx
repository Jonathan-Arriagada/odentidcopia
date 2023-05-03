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

export default SearchBar;