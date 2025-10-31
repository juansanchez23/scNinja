const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "http://backend:8080/api");


const ninjaService = {
  getAllNinjas: async () => {
    const response = await fetch(`${API_BASE_URL}/ninjas`);
    return response.json();
  },

  createNinjaWithFactory: async (nombre, aldea) => {
    const response = await fetch(`${API_BASE_URL}/ninjas/factory?nombre=${nombre}&aldea=${aldea}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  createNinjaWithBuilder: async (ninjaBuilder) => {
    const response = await fetch(`${API_BASE_URL}/ninjas/builder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ninjaBuilder),
    });
    return response.json();
  },

  aceptarMision: async (ninjaId, misionId) => {
    const response = await fetch(`${API_BASE_URL}/ninjas/${ninjaId}/aceptar/${misionId}`, {
      method: 'POST',
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.text();
  },

  entrenarNinja: async (ninjaId, atributo, coste, mejora) => {
    const response = await fetch(`${API_BASE_URL}/ninjas/${ninjaId}/entrenar?atributo=${atributo}&coste=${coste}&mejora=${mejora}`, {
      method: 'POST',
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.text();
  },

  combate: async (n1, j1, n2, j2) => {
    const response = await fetch(`${API_BASE_URL}/ninjas/combate?n1=${n1}&j1=${j1}&n2=${n2}&j2=${j2}`, {
      method: 'POST',
    });
    return response.text();
  },
};

export default ninjaService;