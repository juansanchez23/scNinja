const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "http://backend:8080/api");


const misionService = {
  getAllMisiones: async () => {
    const response = await fetch(`${API_BASE_URL}/misiones`);
    return response.json();
  },

  createMision: async (mision) => {
    const response = await fetch(`${API_BASE_URL}/misiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mision),
    });
    return response.json();
  },
};

export default misionService;