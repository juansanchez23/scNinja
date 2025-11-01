import React, { useState } from 'react';
import ninjaService from '../services/ninjaService';

// 🎯 Jutsus disponibles para seleccionar
const JUTSUS_DISPONIBLES = [
  { nombre: "Rasengan", poder: 80, tipo: "Ninjutsu", chakraCost: 40 },
  { nombre: "Chidori", poder: 75, tipo: "Rayo", chakraCost: 35 },
  { nombre: "Kage Bunshin", poder: 40, tipo: "Neutral", chakraCost: 10 },
  { nombre: "Amaterasu", poder: 100, tipo: "Fuego", chakraCost: 60 },
  { nombre: "Tsukuyomi", poder: 90, tipo: "Genjutsu", chakraCost: 50 },
  { nombre: "Kamui", poder: 95, tipo: "Espacio-Tiempo", chakraCost: 55 },
  { nombre: "Shinra Tensei", poder: 85, tipo: "Gravedad", chakraCost: 45 },
  { nombre: "Substitución", poder: 20, tipo: "Básico", chakraCost: 5 },
  { nombre: "Invocación", poder: 60, tipo: "Neutral", chakraCost: 30 },
  { nombre: "Sello de los 8 Trigramas", poder: 70, tipo: "Taijutsu", chakraCost: 25 },
];

function CreateNinjaBuilder({ onNinjaCreated }) {
  const [nombre, setNombre] = useState('');
  const [aldea, setAldea] = useState('');
  const [rango, setRango] = useState('Genin');
  const [ataque, setAtaque] = useState(25);
  const [defensa, setDefensa] = useState(25);
  const [chakra, setChakra] = useState(50);
  const [selectedJutsus, setSelectedJutsus] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleJutsuToggle = (jutsu) => {
    setSelectedJutsus(prev => {
      const exists = prev.find(j => j.nombre === jutsu.nombre);
      if (exists) {
        return prev.filter(j => j.nombre !== jutsu.nombre);
      } else {
        return [...prev, jutsu];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (selectedJutsus.length === 0) {
      setError("Por favor, selecciona al menos un jutsu.");
      return;
    }

    const ninjaBuilder = {
      nombre,
      aldea,
      rango,
      ataque,
      defensa,
      chakra,
      jutsus: selectedJutsus
    };

    try {
      const newNinja = await ninjaService.createNinjaWithBuilder(ninjaBuilder);
      setMessage(`Ninja ${newNinja.nombre} personalizado creado con éxito!`);
      // Reset form
      setNombre('');
      setAldea('');
      setRango('Genin');
      setAtaque(25);
      setDefensa(25);
      setChakra(50);
      setSelectedJutsus([]);
      onNinjaCreated();
    } catch (err) {
      setError("Error al crear ninja con Builder.");
      console.error("Error creating ninja with builder:", err);
    }
  };

  return (
    <div>
      <h2>Crear Ninja (Builder)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Aldea:
            <input type="text" value={aldea} onChange={(e) => setAldea(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Rango:
            <select value={rango} onChange={(e) => setRango(e.target.value)}>
              <option value="Genin">Genin</option>
              <option value="Chunin">Chunin</option>
              <option value="Jonin">Jonin</option>
              <option value="Kage">Kage</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Ataque:
            <input type="number" value={ataque} onChange={(e) => setAtaque(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Defensa:
            <input type="number" value={defensa} onChange={(e) => setDefensa(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Chakra:
            <input type="number" value={chakra} onChange={(e) => setChakra(Number(e.target.value))} />
          </label>
        </div>

        {/* 🎯 Selección de Jutsus */}
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Selecciona Jutsus (mínimo 1):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {JUTSUS_DISPONIBLES.map((jutsu, index) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedJutsus.some(j => j.nombre === jutsu.nombre)}
                  onChange={() => handleJutsuToggle(jutsu)}
                  style={{ marginRight: '8px' }}
                />
                <span>
                  <strong>{jutsu.nombre}</strong> ({jutsu.tipo}) - Poder: {jutsu.poder}, Coste: {jutsu.chakraCost}
                </span>
              </label>
            ))}
          </div>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Seleccionados: {selectedJutsus.length}
          </p>
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>Crear Ninja Personalizado</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateNinjaBuilder;