// Referencias a elementos del DOM
const bookList = document.getElementById('books');
const categoryFilter = document.getElementById('categoryFilter');
const cart = new Cart();

// Función para obtener libros desde el endpoint
async function fetchBooks(category = '') {
    const response = await fetch(`http://localhost:3000/books${category ? `?category=${category}` : ''}`);
    const books = await response.json();
    bookList.innerHTML = ''; // Limpiar listado previo

    const ul = document.createElement('ul');
    ul.id = 'books';

    books.forEach(book => {
        const li = document.createElement('li');

        const imgLink = document.createElement('a');
        imgLink.href = `libro.html?id=${book.id}`;
        imgLink.title = `Ver detalles de ${book.title}`;

        const img = document.createElement('img');
        img.src = `images/books/${book.id}.png`;
        img.alt = `${book.title} Cover`;
        img.style.borderRadius = '5px';
        
        imgLink.appendChild(img);
        li.appendChild(imgLink);


        const title = document.createElement('h3');
        title.textContent = book.title;

        const author = document.createElement('p');
        author.textContent = `Autor: ${book.author}`;

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'space-between';
        actions.style.alignItems = 'center';

        const cartBtn = document.createElement('button');
        cartBtn.innerHTML = '<i class="fas fa-cart-plus"></i>';
        cartBtn.title = 'Añadir al carrito';
        cartBtn.onclick = () => {
            cart.actualizarProducto(book.isbn, 1);
            mostrarToast();
        };

        const detailsLink = document.createElement('a');
        detailsLink.innerHTML = '<i class="fas fa-info-circle"></i>';
        detailsLink.href = `libro.html?id=${book.id}`;
        detailsLink.title = 'Ver detalles';

        actions.appendChild(cartBtn);
        actions.appendChild(detailsLink);

        li.appendChild(title);
        li.appendChild(author);
        li.appendChild(actions);

        ul.appendChild(li);
    });

    bookList.appendChild(ul);
}


// Actualizar listado al cambiar el filtro
categoryFilter.addEventListener('change', () => {
    const categoria = categoryFilter.value;

    // 1. Actualizar la URL con ?category=...
    const nuevaURL = new URL(window.location.href);
    if (categoria) {
        nuevaURL.searchParams.set('category', categoria);
    } else {
        nuevaURL.searchParams.delete('category');
    }
    window.history.pushState({}, '', nuevaURL);

    // 2. Recargar el listado con la nueva categoría
    fetchBooks(categoria);
});

// Cargar libros al inicio
fetchBooks();

const cartSidebar = document.getElementById('cartSidebar');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

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

clearCartBtn.addEventListener('click', () => {
    cart.vaciarCarrito();
});

function mostrarToast(mensaje = "Producto añadido al carrito") {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000); 
}

async function cargarCategorias() {
    const response = await fetch('http://localhost:3000/books');
    const books = await response.json();
    
    // Extraer categorías únicas
    const categorias = [...new Set(books.map(book => book.category))];

    // Añadir al <select>
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Si hay una categoría en la URL, seleccionarla
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('category');
    if (categoriaActual) {
        categoryFilter.value = categoriaActual;
    }
}

// Al cargar la página: usar categoría de la URL si existe
const categoriaInicial = new URLSearchParams(window.location.search).get('category') || '';
fetchBooks(categoriaInicial);
cargarCategorias();