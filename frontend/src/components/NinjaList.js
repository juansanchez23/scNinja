import React, { useEffect, useState } from 'react';
import ninjaService from '../services/ninjaService';

function NinjaList() {
  const [ninjas, setNinjas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNinjas = async () => {
      try {
        const data = await ninjaService.getAllNinjas();
        setNinjas(data);
      } catch (err) {
        setError("Error al cargar los ninjas.");
        console.error("Error fetching ninjas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNinjas();
  }, []);

  if (loading) return <p>Cargando ninjas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Lista de Ninjas</h2>
      {ninjas.length === 0 ? (
        <p>No hay ninjas registrados.</p>
      ) : (
        <ul>
          {ninjas.map((ninja) => (
            <li key={ninja.id}>
              {ninja.nombre} (Aldea: {ninja.aldea}, Rango: {ninja.rango}, Ataque: {ninja.ataque}, Defensa: {ninja.defensa}, Chakra: {ninja.chakra}, Dinero: {ninja.getDinero})
              <ul>
                {ninja.jutsus && ninja.jutsus.map((jutsu, index) => (
                  <li key={index}>Jutsu: {jutsu.nombre} (Daño: {jutsu.danio}, Coste: {jutsu.costeChakra})</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NinjaList;