# DancyPet — Frontend

SPA en **Angular 19** (componentes standalone y signals) de la tienda de mascotas DancyPet, para el curso **JavaScript Avanzado (39151)**. Consume la API Express de `../backend`.

La arquitectura completa (endpoints, autenticación, pedidos y estructura de carpetas) está documentada en el [README principal](../README.md).

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Levanta la API (`../backend`) y la app a la vez, y abre el navegador |
| `npm start` | Solo el servidor de desarrollo de Angular en `http://localhost:4200` |
| `npm run api` | Solo la API en `http://localhost:3001` |
| `npm run build` | Versión de producción en `dist/dancypet` |

Antes del primer `npm run dev`, instala las dependencias del backend (`cd ../backend && npm install`) y crea su archivo `.env` a partir de `.env.example`.

## Funcionalidades

- **Catálogo:** categorías, búsqueda, orden por precio o nombre, y ficha de cada producto.
- **Carrito:** panel lateral persistido en `localStorage`, con subtotal, IGV (18 %) y total.
- **Pago simulado:** tarjeta (validación Luhn), Yape/Plin o contra entrega. El servidor recalcula el total.
- **Cuenta:** registro, inicio de sesión ("Recordarme") e historial de pedidos.
- **Mascotas:** registro con foto opcional y cálculo de la suscripción mensual de alimento según tipo, edad, peso y tipo de comida.
- **Suscripción:** dirección y horario de entrega semanal, pagada con tarjeta.

Tarjeta de prueba: `4111 1111 1111 1111`, cualquier fecha futura y CVV `123`.

---

Proyecto académico — Universidad Tecnológica del Perú (UTP), 2026.
