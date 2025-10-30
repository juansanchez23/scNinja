
export type Rango = 'Genin' | 'Chunin' | 'Jonin' | 'Kage' | string;
export type Aldea = 'Konoha' | 'Suna' | 'Iwaga' | 'Kiriga' | 'Kumoga' | string;
export type Atributo = 'ataque' | 'defensa' | 'chakra' | 'salud';

export interface Jutsu {
  id?: number;
  nombre: string;
  poder: number;
}

export interface Ninja {
  id: number;
  nombre: string;
  rango: Rango;
  aldea: Aldea;
  ataque: number;
  defensa: number;
  chakra: number;
  salud: number;
  dinero: number;
  jutsus: Jutsu[];
}

export interface Mision {
  id: number;
  descripcion: string;
  rangoMinimo: Rango;
  recompensa: number;
}

export type NinjaBuilderData = Omit<Ninja, 'id'>;

export interface NotificationType {
  message: string;
  type: 'success' | 'error';
}
