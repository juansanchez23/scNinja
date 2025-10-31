import React, { useState } from 'react';
import NinjaList from './components/NinjaList';
import MisionList from './components/MisionList';
import CreateNinjaFactory from './components/CreateNinjaFactory';
import CreateNinjaBuilder from './components/CreateNinjaBuilder';
import AceptarMision from './components/AceptarMision';
import EntrenarNinja from './components/EntrenarNinja';
import CombateNinja from './components/CombateNinja';
import './App.css'; // Opcional: para estilos básicos

function App() {
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar la actualización de listas

  const handleUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1); // Incrementa la clave para forzar re-renderizado
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestión de Ninjas y Misiones</h1>
      </header>
      <main>
        <section className="section-container">
          <NinjaList key={`ninjas-${refreshKey}`} />
        </section>

        <section className="section-container">
          <MisionList key={`misiones-${refreshKey}`} />
        </section>

        <hr />

        <section className="section-container">
          <CreateNinjaFactory onNinjaCreated={handleUpdate} />
        </section>

        <hr />

        <section className="section-container">
          <CreateNinjaBuilder onNinjaCreated={handleUpdate} />
        </section>

        <hr />

        <section className="section-container">
          <AceptarMision onUpdate={handleUpdate} />
        </section>

        <hr />

        <section className="section-container">
          <EntrenarNinja onUpdate={handleUpdate} />
        </section>

        <hr />

        <section className="section-container">
          <CombateNinja onUpdate={handleUpdate} />
        </section>

      </main>
    </div>
  );
}

export default App;