class Cart {
    constructor() {
        const savedItems = localStorage.getItem('cart');
        this.items = savedItems ? JSON.parse(savedItems) : {};
        this.actualizarVista();
    }

    actualizarProducto(isbn, cantidad) {
        if (this.items[isbn]) {
            this.items[isbn] += cantidad;
            if (this.items[isbn] <= 0) {
                delete this.items[isbn];
            }
        } else if (cantidad > 0) {
            this.items[isbn] = cantidad;
        }
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.actualizarVista();
       

    }

    eliminarProducto(isbn) {
        delete this.items[isbn];
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.actualizarVista();
    }

    vaciarCarrito() {
        this.items = {};
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.actualizarVista();
    }

    actualizarVista() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        cartItems.innerHTML = '';
        let total = 0;

        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(books => {
                for (const isbn in this.items) {
                    const book = books.find(b => b.isbn === isbn);
                    if (!book) continue;

                    const cantidad = this.items[isbn];
                    const price = parseFloat(book.price) || 0;
                    const subtotal = price * cantidad;

                    const li = document.createElement('li');
                    li.classList.add('cart-item');
                    li.innerHTML = `
                    <div class="cart-item-left">
                        <img src="images/books/${book.id}.png" alt="${book.title}" class="cart-thumb">
                    </div>
                    <div class="cart-item-details">
                        <h4>${book.title}</h4>
                        <div class="cart-controls">
                        <button class="qty-btn" data-action="decrease">−</button>
                        <span class="qty-value">${cantidad}</span>
                        <button class="qty-btn" data-action="increase">+</button>
                        </div>
                        <p class="cart-item-pricing">${price.toFixed(2)} €/ud × ${cantidad} = <strong>${subtotal.toFixed(2)} €</strong></p>
                    </div>
                    <div class="cart-item-remove-container">
                        <button class="cart-item-remove" title="Eliminar del carrito">
                        <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    `;

                    li.querySelector('.cart-item-remove').onclick = () => this.eliminarProducto(isbn);
                    li.querySelector('[data-action="increase"]').onclick = () => this.actualizarProducto(isbn, 1);
                    li.querySelector('[data-action="decrease"]').onclick = () => this.actualizarProducto(isbn, -1);

                    cartItems.appendChild(li);
                    total += subtotal;
                }

                cartTotal.textContent = `${total.toFixed(2)} €`;
            })
            .catch(error => {
                console.error('Error al cargar los libros:', error);
                cartTotal.textContent = 'Error al calcular total';
            });
    }
}