const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


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