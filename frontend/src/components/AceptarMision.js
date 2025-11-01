import React, { useState, useEffect } from 'react';
import ninjaService from '../services/ninjaService';
import misionService from '../services/misionService';

function AceptarMision({ onUpdate }) {
  const [ninjas, setNinjas] = useState([]);
  const [misiones, setMisiones] = useState([]);
  const [selectedNinja, setSelectedNinja] = useState('');
  const [selectedMision, setSelectedMision] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ninjasData = await ninjaService.getAllNinjas();
        setNinjas(ninjasData);
        const misionesData = await misionService.getAllMisiones();
        setMisiones(misionesData);
      } catch (err) {
        setError("Error al cargar ninjas o misiones.");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!selectedNinja || !selectedMision) {
      setError("Por favor, selecciona un ninja y una misión.");
      return;
    }

    try {
      const response = await ninjaService.aceptarMision(selectedNinja, selectedMision);
      setMessage(response);
      onUpdate(); // Notificar para recargar listas
    } catch (err) {
      setError(err.message || "Error al aceptar la misión.");
      console.error("Error aceptando misión:", err);
    }
  };

  return (
    <div>
      <h2>Aceptar Misión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Ninja:
            <select value={selectedNinja} onChange={(e) => setSelectedNinja(e.target.value)} required>
              <option value="">Selecciona un ninja</option>
              {ninjas.map((ninja) => (
                <option key={ninja.id} value={ninja.id}>
                  {ninja.nombre} (Rango: {ninja.rango}, Dinero: {ninja.dinero})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Misión:
            <select value={selectedMision} onChange={(e) => setSelectedMision(e.target.value)} required>
              <option value="">Selecciona una misión</option>
              {misiones.map((mision) => (
                <option key={mision.id} value={mision.id}>
                  {mision.nombre} (Rango: {mision.rango}, Recompensa: {mision.recompensa})
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Aceptar Misión</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AceptarMision;