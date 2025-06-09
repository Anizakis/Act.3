# Proyecto de Detalles de Libros

## Descripción del Proyecto
Este proyecto es una aplicación web para mostrar detalles de libros, opiniones y libros relacionados. Utiliza un servidor mock (`json-server`) para simular endpoints de API.

---

## Cómo Iniciar el Proyecto

### Requisitos Previos
- Node.js instalado en tu sistema.
- `npm` (incluido con Node.js).

### Pasos para Iniciar el Proyecto
1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. Instala las dependencias:  
   ```bash
   npm install
   ```
3. Inicia el servidor mock:
```bash
   npx json-server --watch db.json --port 3000
   ```
El servidor mock estará disponible en http://localhost:3000.

4. Abre `index.html` en tu navegador para ver la aplicación.

<hr></hr>

## Detalles de los Archivos
### Estructura del Proyecto
```
project-root/
├── index.html
├── libro.html
├── libro.js
├── listado.html
├── listado.js
├── cart.js
├── db.json
├── styles.css
├── readme.md
└── package.json
```
### Descripción de los Archivos
#### index.html
Página principal de la aplicación.

#### libro.html
Contiene la estructura de la página web.
Incluye secciones para detalles del libro, opiniones y libros relacionados.
Incluye un modal para añadir opiniones.

#### libro.js
Maneja la lógica para obtener y mostrar detalles del libro, opiniones y libros relacionados.
Incluye funcionalidad para añadir opiniones mediante el modal.

#### listado.html
Página para listar todos los libros disponibles.

#### listado.js
Maneja la lógica para obtener y mostrar la lista de libros.

#### cart.js
Maneja la lógica del carrito de compras (si aplica).

#### db.json
Base de datos mock para el proyecto.

**Contiene:**
- books: Lista de libros con sus detalles (ID, título, autor, categoría, etc.).
- reviews: Lista de opiniones asociadas a los libros.


#### styles.css
Contiene los estilos para la aplicación web.

#### readme.md
Documentación del proyecto.

#### package.json
Archivo de configuración del proyecto que incluye las dependencias y scripts necesarios.

### Dependencias
- `json-server`: Para simular un servidor RESTful con una base de datos mock.
