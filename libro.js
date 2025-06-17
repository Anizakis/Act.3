// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Función para obtener detalles del libro
async function fetchBookDetails() {
    const response = await fetch(`http://localhost:3000/books/${bookId}`);
    const book = await response.json();

    // Mostrar detalles del libro
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <img src="images/books/${book.id}.png" alt="${book.title} Cover" style="width: 200px; border-radius: 5px;">
        <p><strong>Título:</strong> ${book.title}</p>
        <p><strong>Autor:</strong> ${book.author}</p>
    `;

    fetchRelatedBooks(book.category); // Pasar la categoría del libro a fetchRelatedBooks
}

// Función para obtener opiniones del libro
async function fetchReviews() {
    const response = await fetch(`http://localhost:3000/reviews?bookId=${bookId}`);
    const reviews = await response.json();

    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = ''; // Limpiar opiniones previas

    // Manejar respuesta como objeto o array
    if (Array.isArray(reviews)) {
        reviews.forEach(review => {
            const li = document.createElement('li');
            li.textContent = `${review.text} - ${review.rating}/5`;
            reviewList.appendChild(li);
        });
    } else if (reviews && typeof reviews === 'object') {
        const li = document.createElement('li');
        li.textContent = `${reviews.text} - ${reviews.rating}/5`;
        reviewList.appendChild(li);
    } else {
        console.error('Formato inesperado en la respuesta de reviews:', reviews);
    }
}

// Libros relacionados
async function fetchRelatedBooks(category) {
    try {
        const response = await fetch(`http://localhost:3000/books?category=${category}`);
        const relatedBooks = await response.json();
        const relatedBooksList = document.getElementById('relatedBooksList');
        relatedBooksList.innerHTML = '';

        relatedBooks.forEach(book => {
            if (book.id.toString() !== bookId.toString()) { // Excluir el libro actual (corrección)
                const li = document.createElement('li');
                li.className = 'related-card';
                li.innerHTML = `
          <a href="libro.html?id=${book.id}">
            <img src="images/books/${book.id}.png" alt="${book.title} Cover" />
            <h4>${book.title}</h4>
            <p>${book.author}</p>
          </a>
        `;
                relatedBooksList.appendChild(li);
            } else {
                console.log('Excluyendo libro actual:', book.id);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}



// Mostrar modal para añadir opinión
document.getElementById('addReviewButton').addEventListener('click', () => {
    document.getElementById('reviewModal').style.display = 'flex';
});

// Cerrar el modal al hacer clic fuera del formulario
document.getElementById('reviewModal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('reviewModal')) {
        document.getElementById('reviewModal').style.display = 'none';
    }
});

// Cerrar el modal al hacer clic en el botón de cerrar
document.getElementById('closeModalButton').addEventListener('click', () => {
    document.getElementById('reviewModal').style.display = 'none';
});

// Enviar el formulario
document.getElementById('reviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const reviewText = document.getElementById('reviewText').value.trim();
    const reviewRating = document.getElementById('reviewRating').value;

    if (reviewText && reviewRating) {
        try {
            const response = await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId: bookId,
                    text: reviewText,
                    rating: parseInt(reviewRating)
                })
            });

            if (!response.ok) {
                throw new Error('Error al guardar la opinión');
            }

            document.getElementById('reviewModal').style.display = 'none';
            document.getElementById('reviewForm').reset();

            await fetchReviews();
            mostrarOpinionToast(); 

        } catch (error) {
            console.error('Error al enviar la opinión:', error);
        }
    }
});

function mostrarOpinionToast(mensaje = "Opinión enviada correctamente") {
    const toast = document.getElementById('opinionToast');
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}




// Cargar datos al inicio
fetchBookDetails();
fetchReviews();
fetchRelatedBooks();