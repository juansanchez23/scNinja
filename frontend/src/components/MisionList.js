import React, { useEffect, useState } from 'react';
import misionService from '../services/misionService';

function MisionList() {
  const [misiones, setMisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        const data = await misionService.getAllMisiones();
        setMisiones(data);
      } catch (err) {
        setError("Error al cargar las misiones.");
        console.error("Error fetching misiones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMisiones();
  }, []);

  if (loading) return <p>Cargando misiones...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Lista de Misiones</h2>
      {misiones.length === 0 ? (
        <p>No hay misiones disponibles.</p>
      ) : (
        <ul>
          {misiones.map((mision) => (
            <li key={mision.id}>
              {mision.nombre} (Rango: {mision.rango}, Recompensa: {mision.recompensa} ryo)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisionList;