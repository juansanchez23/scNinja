import React, { useState, useEffect } from 'react';
import ninjaService from '../services/ninjaService';

function CombateNinja({ onUpdate }) {
  const [ninjas, setNinjas] = useState([]);
  const [selectedNinja1, setSelectedNinja1] = useState('');
  const [selectedJutsu1, setSelectedJutsu1] = useState('');
  const [selectedNinja2, setSelectedNinja2] = useState('');
  const [selectedJutsu2, setSelectedJutsu2] = useState('');
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
    if (!selectedNinja1 || !selectedJutsu1 || !selectedNinja2 || !selectedJutsu2) {
      setError("Por favor, selecciona ambos ninjas y sus jutsus.");
      return;
    }
    if (selectedNinja1 === selectedNinja2) {
        setError("Los ninjas no pueden combatir consigo mismos.");
        return;
    }

    try {
      const response = await ninjaService.combate(
        selectedNinja1,
        selectedJutsu1,
        selectedNinja2,
        selectedJutsu2
      );
      setMessage(response);
      onUpdate(); // Notificar para recargar la lista de ninjas por si sus atributos cambiaron
    } catch (err) {
      setError(err.message || "Error durante el combate.");
      console.error("Error en combate:", err);
    }
  };

  const getNinjaJutsus = (ninjaId) => {
    const ninja = ninjas.find(n => String(n.id) === String(ninjaId));
    return ninja ? ninja.jutsus : [];
  };

  return (
    <div>
      <h2>Simular Combate</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Ninja 1</h3>
          <label>
            Seleccionar Ninja:
            <select value={selectedNinja1} onChange={(e) => {
                setSelectedNinja1(e.target.value);
                setSelectedJutsu1(''); // Reset jutsu when ninja changes
            }} required>
              <option value="">Selecciona</option>
              {ninjas.map((ninja) => (
                <option key={ninja.id} value={ninja.id}>{ninja.nombre} (A: {ninja.ataque}, D: {ninja.defensa}, C: {ninja.chakra})</option>
              ))}
            </select>
          </label>
        </div>
        {selectedNinja1 && (
          <div>
            <label>
              Seleccionar Jutsu:
              <select value={selectedJutsu1} onChange={(e) => setSelectedJutsu1(e.target.value)} required>
                <option value="">Selecciona un jutsu</option>
                {getNinjaJutsus(selectedNinja1).map((jutsu, index) => (
                  <option key={index} value={index}>{jutsu.nombre} (Daño: {jutsu.danio}, Coste: {jutsu.costeChakra})</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3>Ninja 2</h3>
          <label>
            Seleccionar Ninja:
            <select value={selectedNinja2} onChange={(e) => {
                setSelectedNinja2(e.target.value);
                setSelectedJutsu2(''); // Reset jutsu when ninja changes
            }} required>
              <option value="">Selecciona</option>
              {ninjas.map((ninja) => (
                <option key={ninja.id} value={ninja.id}>{ninja.nombre} (A: {ninja.ataque}, D: {ninja.defensa}, C: {ninja.chakra})</option>
              ))}
            </select>
          </label>
        </div>
        {selectedNinja2 && (
          <div>
            <label>
              Seleccionar Jutsu:
              <select value={selectedJutsu2} onChange={(e) => setSelectedJutsu2(e.target.value)} required>
                <option value="">Selecciona un jutsu</option>
                {getNinjaJutsus(selectedNinja2).map((jutsu, index) => (
                  <option key={index} value={index}>{jutsu.nombre} (Daño: {jutsu.danio}, Coste: {jutsu.costeChakra})</option>
                ))}
              </select>
            </label>
          </div>
        )}
        <button type="submit" style={{ marginTop: '20px' }}>Iniciar Combate</button>
      </form>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CombateNinja;