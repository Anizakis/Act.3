// Referencias a elementos del DOM
const bookList = document.getElementById('books');
const categoryFilter = document.getElementById('categoryFilter');
const cart = new Cart();

// Función para obtener libros desde el endpoint
async function fetchBooks(category = '') {
    const response = await fetch(`http://localhost:3000/books${category ? `?category=${category}` : ''}`);
    const books = await response.json();
    bookList.innerHTML = ''; // Limpiar listado previo

    // Crear tabla
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Imagen</th>
        <th>Título</th>
        <th>Autor</th>
        <th>Acciones</th>
    `;
    table.appendChild(headerRow);

    books.forEach(book => {
        const row = document.createElement('tr');

        // Columna de imagen
        const imageCell = document.createElement('td');
        const bookImage = document.createElement('img');
        bookImage.src = `images/books/${book.id}.png`;
        bookImage.alt = `${book.title} Cover`;
        bookImage.style.width = '100px'; // Ajustar tamaño de la imagen
        imageCell.appendChild(bookImage);
        row.appendChild(imageCell);

        // Columna de título
        const titleCell = document.createElement('td');
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        // Columna de autor
        const authorCell = document.createElement('td');
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        // Columna de acciones
        const actionsCell = document.createElement('td');

        // Botón para añadir al carrito con icono
        const addToCartButton = document.createElement('button');
        addToCartButton.innerHTML = '<i class="fas fa-cart-plus"></i>'; // Icono de Font Awesome
        addToCartButton.title = 'Añadir al Carrito'; // Descripción al pasar el mouse
        addToCartButton.onclick = () => {
            cart.actualizarProducto(book.isbn, 1);
            mostrarToast();
        };
        actionsCell.appendChild(addToCartButton);

        // Enlace para ver detalles con icono
        const detailsLink = document.createElement('a');
        detailsLink.innerHTML = '<i class="fas fa-info-circle"></i>'; // Icono de Font Awesome
        detailsLink.title = 'Ver Detalles'; // Descripción al pasar el mouse
        detailsLink.href = `libro.html?id=${book.id}`;
        actionsCell.appendChild(detailsLink);

        row.appendChild(actionsCell);

        table.appendChild(row);
    });

    bookList.appendChild(table);
}

// Actualizar listado al cambiar el filtro
categoryFilter.addEventListener('change', () => {
    fetchBooks(categoryFilter.value);
});

// Cargar libros al inicio
fetchBooks();



const cartSidebar = document.getElementById('cartSidebar');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');

openCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    openCartBtn.classList.add('hidden'); 
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    setTimeout(() => {
        openCartBtn.classList.remove('hidden');
    }, 400); 
});


function mostrarToast(mensaje = "Producto añadido al carrito") {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000); 
}
