import React, { useState, useEffect } from 'react';
import ninjaService from '../services/ninjaService';

function EntrenarNinja({ onUpdate }) {
  const [ninjas, setNinjas] = useState([]);
  const [selectedNinja, setSelectedNinja] = useState('');
  const [atributo, setAtributo] = useState('ataque');
  const [coste, setCoste] = useState(10);
  const [mejora, setMejora] = useState(5);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNinjas = async () => {
      try {
        const data = await ninjaService.getAllNinjas();
        setNinjas(data);
      } catch (err) {
        setError("Error al cargar los ninjas.");
        console.error("Error fetching ninjas:", err);
      }
    };
    fetchNinjas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!selectedNinja) {
      setError("Por favor, selecciona un ninja.");
      return;
    }

    try {
      const response = await ninjaService.entrenarNinja(selectedNinja, atributo, coste, mejora);
      setMessage(response);
      onUpdate(); // Notificar para recargar lista de ninjas
    } catch (err) {
      setError(err.message || "Error al entrenar al ninja.");
      console.error("Error entrenando ninja:", err);
    }
  };

  return (
    <div>
      <h2>Entrenar Ninja</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Ninja:
            <select value={selectedNinja} onChange={(e) => setSelectedNinja(e.target.value)} required>
              <option value="">Selecciona un ninja</option>
              {ninjas.map((ninja) => (
                <option key={ninja.id} value={ninja.id}>{ninja.nombre} (Dinero: {ninja.getDinero})</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Atributo a mejorar:
            <select value={atributo} onChange={(e) => setAtributo(e.target.value)}>
              <option value="ataque">Ataque</option>
              <option value="defensa">Defensa</option>
              <option value="chakra">Chakra</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Coste:
            <input type="number" value={coste} onChange={(e) => setCoste(Number(e.target.value))} required />
          </label>
        </div>
        <div>
          <label>
            Mejora:
            <input type="number" value={mejora} onChange={(e) => setMejora(Number(e.target.value))} required />
          </label>
        </div>
        <button type="submit">Entrenar</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default EntrenarNinja;