import "./App.css";
import Show from "./components/Show";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./components/Create";
import Edit from "./components/Edit";
import { auth } from "./firebaseConfig/firebase";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  });
  return (
    <div className="App">
      <BrowserRouter>
        {LoggedIn ? (
          <Routes>
            <Route path="/" element={<Show />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
