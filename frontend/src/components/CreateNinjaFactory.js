import React, { useState } from 'react';
import ninjaService from '../services/ninjaService';

function CreateNinjaFactory({ onNinjaCreated }) {
  const [nombre, setNombre] = useState('');
  const [aldea, setAldea] = useState('Konoha');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const newNinja = await ninjaService.createNinjaWithFactory(nombre, aldea);
      setMessage(`Ninja ${newNinja.nombre} de ${newNinja.aldea} creado con éxito!`);
      setNombre('');
      onNinjaCreated(); // Notificar al padre para recargar la lista
    } catch (err) {
      setError("Error al crear ninja con Factory.");
      console.error("Error creating ninja with factory:", err);
    }
  };

  return (
    <div>
      <h2>Crear Ninja (Factory)</h2>
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
            <select value={aldea} onChange={(e) => setAldea(e.target.value)}>
              <option value="Konoha">Konoha</option>
              <option value="Suna">Suna</option>
              <option value="Iwaga">Iwaga</option>
              <option value="Kiriga">Kiriga</option>
              <option value="Kumoga">Kumoga</option>
            </select>
          </label>
        </div>
        <button type="submit">Crear Ninja</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateNinjaFactory;