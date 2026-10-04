export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  anio: number;
  precio: number;
  stock: number;
  portada: string;
  descripcion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}
