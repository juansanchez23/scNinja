
import { Ninja, Mision, NinjaBuilderData, Atributo } from '../types';

const BASE_URL = '/api';

async function handleResponse<T,>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.statusText} - ${errorText}`);
  }
  // Handle cases where response might be empty
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    return text as unknown as T; // For non-JSON responses like plain strings
  }
}


export const api = {
  // Ninja endpoints
  getNinjas: (): Promise<Ninja[]> => fetch(`${BASE_URL}/ninjas`).then(res => handleResponse<Ninja[]>(res)),
  createNinjaFactory: (nombre: string, aldea: string): Promise<Ninja> => {
    const params = new URLSearchParams({ nombre, aldea });
    return fetch(`${BASE_URL}/ninjas/factory?${params.toString()}`, { method: 'POST' }).then(res => handleResponse<Ninja>(res));
  },
  createNinjaBuilder: (builder: NinjaBuilderData): Promise<Ninja> => {
    return fetch(`${BASE_URL}/ninjas/builder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(builder),
    }).then(res => handleResponse<Ninja>(res));
  },
  acceptMision: (ninjaId: number, misionId: number): Promise<string> => {
    return fetch(`${BASE_URL}/ninjas/${ninjaId}/aceptar/${misionId}`, { method: 'POST' }).then(res => handleResponse<string>(res));
  },
  trainNinja: (ninjaId: number, atributo: Atributo, coste: number, mejora: number): Promise<string> => {
    const params = new URLSearchParams({ atributo, coste: String(coste), mejora: String(mejora) });
    return fetch(`${BASE_URL}/ninjas/${ninjaId}/entrenar?${params.toString()}`, { method: 'POST' }).then(res => handleResponse<string>(res));
  },
  startCombat: (n1: number, j1: number, n2: number, j2: number): Promise<string> => {
    const params = new URLSearchParams({ n1: String(n1), j1: String(j1), n2: String(n2), j2: String(j2) });
    return fetch(`${BASE_URL}/ninjas/combate?${params.toString()}`, { method: 'POST' }).then(res => handleResponse<string>(res));
  },

  // Mision endpoints
  getMisiones: (): Promise<Mision[]> => fetch(`${BASE_URL}/misiones`).then(res => handleResponse<Mision[]>(res)),
  createMision: (mision: Omit<Mision, 'id'>): Promise<Mision> => {
    return fetch(`${BASE_URL}/misiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mision),
    }).then(res => handleResponse<Mision>(res));
  },
};
