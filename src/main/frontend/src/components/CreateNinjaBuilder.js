import React, { useState } from 'react';
import ninjaService from '../services/ninjaService';

function CreateNinjaBuilder({ onNinjaCreated }) {
  const [nombre, setNombre] = useState('');
  const [aldea, setAldea] = useState('');
  const [rango, setRango] = useState('GENIN');
  const [ataque, setAtaque] = useState(10);
  const [defensa, setDefensa] = useState(10);
  const [chakra, setChakra] = useState(50);
  const [dinero, setDinero] = useState(100);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const ninjaBuilder = {
      nombre,
      aldea,
      rango,
      ataque,
      defensa,
      chakra,
      dinero,
    };
    try {
      const newNinja = await ninjaService.createNinjaWithBuilder(ninjaBuilder);
      setMessage(`Ninja ${newNinja.nombre} personalizado creado con éxito!`);
      setNombre('');
      setAldea('');
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
              <option value="GENIN">GENIN</option>
              <option value="CHUNIN">CHUNIN</option>
              <option value="JOUNIN">JOUNIN</option>
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
        <div>
          <label>
            Dinero:
            <input type="number" value={dinero} onChange={(e) => setDinero(Number(e.target.value))} />
          </label>
        </div>
        <button type="submit">Crear Ninja Personalizado</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateNinjaBuilder;