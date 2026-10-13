# BiblioUTP — Sistema de Gestión de Biblioteca

Aplicación web desarrollada con **Angular 19**, **Bootstrap 5** y un back-end REST simulado con **json-server**, para el curso **JavaScript Avanzado (39151)** — Unidad de aprendizaje 2: *Angular*.

Permite administrar el catálogo de libros de una biblioteca (crear, ver, editar y eliminar) y registrar los préstamos de los lectores, controlando automáticamente el stock disponible.

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Funcionalidades](#funcionalidades)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Back-end en JSON y API REST](#back-end-en-json-y-api-rest)
7. [Navegación (rutas)](#navegación-rutas)
8. [Componentes](#componentes)
9. [Directivas](#directivas)
10. [Pipes](#pipes)
11. [Formularios](#formularios)
12. [Servicios](#servicios)
13. [Relación con el temario](#relación-con-el-temario)

---

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Node.js 22 / npm 10 | Entorno de ejecución y gestor de paquetes |
| Angular 19 (standalone components) | Framework del front-end |
| TypeScript 5.7 | Lenguaje de programación |
| Bootstrap 5 + Bootstrap Icons | Estilos, diseño responsive e íconos |
| json-server 0.17 | Back-end REST a partir de un archivo JSON |
| concurrently | Ejecutar API y front-end con un solo comando |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18.19 o superior
- Angular CLI (opcional, el proyecto lo incluye como dependencia):

```bash
npm install -g @angular/cli
```

## Instalación y ejecución

```bash
# 1. Entrar a la carpeta del proyecto
cd biblioteca

# 2. Instalar dependencias
npm install

# 3. Levantar la API (puerto 3000) y la app Angular (puerto 4200) a la vez
npm run dev
```

También pueden ejecutarse por separado, en dos terminales:

```bash
npm run api     # json-server en http://localhost:3000
npm start       # Angular en http://localhost:4200
```

| Script | Descripción |
| --- | --- |
| `npm run dev` | Inicia la API y la aplicación, y abre el navegador |
| `npm run api` | Inicia solo json-server observando `db.json` |
| `npm start` | Inicia solo el servidor de desarrollo de Angular |
| `npm run build` | Genera la versión de producción en `dist/biblioteca` |

> **Importante:** si la API no está activa, la aplicación mostrará un mensaje indicando que se ejecute `npm run api`.

## Funcionalidades

- **Inicio (dashboard):** indicadores de total de títulos, ejemplares, préstamos activos y valor del inventario.
- **Catálogo:** listado de libros en tarjetas, con búsqueda por título o autor y filtro por categoría.
- **Detalle de libro:** información completa, disponibilidad y accesos para editar, prestar o eliminar.
- **Registro y edición de libros:** formulario con validaciones.
- **Préstamos:** registro de préstamos, filtro por estado (activos, vencidos, devueltos), devolución y eliminación.
- **Control de stock:** al registrar un préstamo el stock baja en 1; al devolverlo, sube en 1.
- **Página 404** para rutas inexistentes.

## Estructura del proyecto

```
biblioteca/
├── db.json                      # Base de datos JSON (back-end)
├── angular.json                 # Configuración de Angular (incluye Bootstrap)
├── package.json                 # Dependencias y scripts
└── src/
    ├── index.html
    ├── styles.css               # Estilos globales
    ├── environments/
    │   └── environment.ts       # URL de la API
    └── app/
        ├── app.component.ts     # Componente raíz (navbar + router-outlet + footer)
        ├── app.config.ts        # Providers: router, HttpClient, locale es-PE
        ├── app.routes.ts        # Definición de rutas
        ├── models/              # Interfaces TypeScript
        │   ├── libro.ts
        │   └── prestamo.ts
        ├── services/            # Consumo de la API REST
        │   ├── libro.service.ts
        │   └── prestamo.service.ts
        ├── pipes/               # Pipes personalizados
        │   ├── truncar.pipe.ts
        │   ├── dias-restantes.pipe.ts
        │   └── filtrar-libros.pipe.ts
        ├── directives/          # Directivas personalizadas
        │   ├── resaltar.directive.ts
        │   ├── estado-stock.directive.ts
        │   └── repetir.directive.ts
        ├── components/          # Componentes reutilizables
        │   ├── navbar/
        │   ├── footer/
        │   └── libro-card/
        └── pages/               # Vistas asociadas a rutas
            ├── inicio/
            ├── libros/
            ├── libro-detalle/
            ├── libro-form/
            ├── prestamos/
            └── no-encontrado/
```

## Back-end en JSON y API REST

El archivo `db.json` contiene tres colecciones que json-server expone como recursos REST:

| Recurso | Descripción |
| --- | --- |
| `/libros` | Catálogo de libros (título, autor, ISBN, categoría, año, precio, stock, portada, descripción) |
| `/categorias` | Categorías disponibles para clasificar libros |
| `/prestamos` | Préstamos (libro, lector, email, fechas, estado de devolución) |

Endpoints utilizados por la aplicación:

| Método | Endpoint | Acción |
| --- | --- | --- |
| GET | `/libros` | Listar libros |
| GET | `/libros/:id` | Obtener un libro |
| POST | `/libros` | Crear un libro |
| PUT | `/libros/:id` | Actualizar un libro completo |
| PATCH | `/libros/:id` | Actualizar solo el stock |
| DELETE | `/libros/:id` | Eliminar un libro |
| GET | `/categorias` | Listar categorías |
| GET | `/prestamos` | Listar préstamos |
| POST | `/prestamos` | Registrar un préstamo |
| PATCH | `/prestamos/:id` | Marcar como devuelto |
| DELETE | `/prestamos/:id` | Eliminar un préstamo |

**Herramientas de prueba:** los endpoints pueden probarse directamente en el navegador (peticiones GET, por ejemplo `http://localhost:3000/libros`) o con herramientas como **Postman**, **Thunder Client** (extensión de VS Code) o `curl`:

```bash
curl http://localhost:3000/libros
curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -d "{\"nombre\":\"Poesía\"}"
```

## Navegación (rutas)

Definidas en `src/app/app.routes.ts`:

| Ruta | Componente | Descripción |
| --- | --- | --- |
| `/` | `InicioComponent` | Dashboard con indicadores |
| `/libros` | `LibrosComponent` | Catálogo con búsqueda y filtros |
| `/libros/nuevo` | `LibroFormComponent` | Registrar un libro |
| `/libros/:id` | `LibroDetalleComponent` | Detalle de un libro |
| `/libros/:id/editar` | `LibroFormComponent` | Editar un libro |
| `/prestamos` | `PrestamosComponent` | Gestión de préstamos (acepta `?libro=ID`) |
| `**` | `NoEncontradoComponent` | Página 404 |

Características usadas:

- `routerLink` y `routerLinkActive` para el menú con la opción activa resaltada.
- `withComponentInputBinding()`: los parámetros de ruta (`:id`) y query params (`?libro=`) llegan como `@Input()` al componente.
- `Router.navigate()` para redirigir después de guardar o eliminar.
- Propiedad `title` en cada ruta para cambiar el título de la pestaña.

## Componentes

Todos son **standalone components** (sin `NgModule`).

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| `AppComponent` | Raíz | Estructura general: navbar, `<router-outlet>` y footer |
| `NavbarComponent` | Reutilizable | Menú de navegación responsive de Bootstrap |
| `FooterComponent` | Reutilizable | Pie de página con la fecha actual |
| `LibroCardComponent` | Reutilizable | Tarjeta de un libro. Recibe el libro con `@Input()` y emite `(eliminar)` con `@Output()` |
| `InicioComponent` | Página | Dashboard; usa `forkJoin` para combinar dos peticiones |
| `LibrosComponent` | Página | Catálogo, búsqueda, filtros y eliminación |
| `LibroDetalleComponent` | Página | Vista detallada de un libro |
| `LibroFormComponent` | Página | Formulario reactivo para crear y editar |
| `PrestamosComponent` | Página | Formulario de préstamo y tabla de préstamos |
| `NoEncontradoComponent` | Página | Error 404 |

**Comunicación padre-hijo** (`LibrosComponent` → `LibroCardComponent`):

```html
<app-libro-card [libro]="libro" (eliminar)="eliminar($event)" />
```

## Directivas

### Directivas de atributo

| Directiva | Origen | Uso en el proyecto |
| --- | --- | --- |
| `ngClass` | Angular | Íconos dinámicos en el menú y filas de préstamos vencidos en rojo |
| `[class.x]` | Angular | Clases `is-invalid`, `active` y `disabled` según el estado |
| `appResaltar` | Personalizada | Eleva la tarjeta y le agrega sombra al pasar el mouse (`@HostListener` + `Renderer2`) |
| `appEstadoStock` | Personalizada | Colorea el stock: verde (> 2), amarillo (1–2), rojo (0) (`@HostBinding`) |

```html
<div class="card" appResaltar>...</div>
<span [appEstadoStock]="libro.stock">Stock: {{ libro.stock }}</span>
```

### Directivas estructurales

| Directiva | Origen | Uso en el proyecto |
| --- | --- | --- |
| `*ngIf` / `else` | Angular | Mensajes de error, estados de carga, resultados vacíos |
| `*ngFor` + `trackBy` | Angular | Listado de libros, categorías, préstamos y enlaces del menú |
| `ngSwitch` | Angular | Estado del préstamo y mensajes de error del campo año |
| `*appRepetir` | Personalizada | Repite una plantilla N veces; se usa para las tarjetas de carga (*skeleton*) |

```html
<div *appRepetir="4">Tarjeta de carga...</div>
```

## Pipes

### Pipes de Angular

| Pipe | Ejemplo | Resultado |
| --- | --- | --- |
| `currency` | `{{ 59.9 \| currency: 'PEN' }}` | S/ 59.90 |
| `date` | `{{ fecha \| date: 'dd/MM/yyyy' }}` | 28/09/2026 |
| `number` | `{{ 21 \| number }}` | 21 |
| `titlecase` | `{{ 'ana torres' \| titlecase }}` | Ana Torres |
| `uppercase` | `{{ 'Novela' \| uppercase }}` | NOVELA |

La configuración regional está registrada como **es-PE** (`app.config.ts`), por lo que monedas y fechas se muestran en formato peruano.

### Pipes personalizados

| Pipe | Descripción | Ejemplo |
| --- | --- | --- |
| `truncar` | Recorta un texto al límite indicado y agrega `...` | `{{ descripcion \| truncar: 90 }}` |
| `diasRestantes` | Calcula los días que faltan o que pasaron desde la fecha de devolución | `Faltan 8 días`, `Vencido hace 5 días` |
| `filtrarLibros` | Filtra el arreglo de libros por texto (título/autor) y categoría | `libros \| filtrarLibros: busqueda : categoria` |

## Formularios

### Formulario reactivo — Libros (`LibroFormComponent`)

Construido con `FormBuilder` y `ReactiveFormsModule`. Se reutiliza para **crear** y **editar** (si la ruta trae `:id`, carga el libro con `setValue`).

| Campo | Validaciones |
| --- | --- |
| Título | Obligatorio, mínimo 2 caracteres |
| Autor | Obligatorio, mínimo 3 caracteres |
| ISBN | Obligatorio, patrón `978-XXXXXXXXXX` |
| Categoría | Obligatoria |
| Año | Obligatorio, mínimo 1450, **validador personalizado** `anioValido` (no permite años futuros) |
| Precio | Obligatorio, mayor a 0 |
| Stock | Obligatorio, entre 0 y 100 |
| Portada | Opcional, debe ser URL `http(s)://` |
| Descripción | Obligatoria, máximo 500 caracteres (con contador) |

### Formulario basado en plantilla — Préstamos (`PrestamosComponent`)

Construido con `FormsModule` y `[(ngModel)]`, usando referencias de plantilla (`#f="ngForm"`, `#email="ngModel"`).

- Libro: obligatorio (solo muestra libros con stock).
- Lector: obligatorio, mínimo 3 caracteres.
- Email: obligatorio, formato de correo (`email`).
- Fecha de devolución: no puede ser anterior a la fecha de préstamo.

En ambos formularios los errores se muestran con las clases de Bootstrap `is-invalid` / `invalid-feedback`, y el botón de guardar se deshabilita mientras el formulario es inválido o se está enviando.

## Servicios

Los servicios se inyectan con `inject()` y están registrados con `providedIn: 'root'`. Consumen la API mediante `HttpClient` (habilitado con `provideHttpClient()` en `app.config.ts`) y devuelven `Observable`.

```typescript
@Injectable({ providedIn: 'root' })
export class LibroService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/libros`;

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.url);
  }
  // obtener, crear, actualizar, actualizarStock, eliminar, categorias...
}
```

Operadores RxJS utilizados:

- `forkJoin`: espera varias peticiones en paralelo (libros + préstamos).
- `switchMap`: encadena peticiones (registrar préstamo → actualizar stock).

## Relación con el temario

| Tema del sílabo | Dónde se aplica |
| --- | --- |
| NodeJS: instalación, consola y TypeScript | Proyecto creado con Angular CLI sobre Node.js; todo el código está en TypeScript con interfaces tipadas |
| Angular: proyectos, directivas de atributos y estructurales | Directivas nativas y 3 personalizadas (`appResaltar`, `appEstadoStock`, `*appRepetir`) |
| Instalación de Bootstrap | Bootstrap e íconos instalados con npm y registrados en `angular.json` |
| Navegación | 7 rutas, parámetros de ruta, query params, `routerLinkActive`, página 404 |
| Componentes | 10 componentes standalone con `@Input()` / `@Output()` |
| Pipes / formateo de elementos | 5 pipes nativos y 3 personalizados, locale `es-PE` |
| Formularios | Formulario reactivo (libros) y basado en plantilla (préstamos) con validaciones |
| Back-end en JSON y métodos REST | `db.json` + json-server con GET, POST, PUT, PATCH y DELETE |
| Herramientas de prueba | Endpoints verificables con navegador, Postman, Thunder Client o curl |
| Servicios y aplicación que consume REST | `LibroService` y `PrestamoService` con `HttpClient` y RxJS |

---

Proyecto académico — Universidad Tecnológica del Perú (UTP), 2026.
