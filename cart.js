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
                    const info = document.createElement('div');
                    info.classList.add('cart-item-info');
                    info.innerHTML = `
                        <strong>${book.title}</strong><br>
                        ${price.toFixed(2)} €/ud × ${cantidad} = <strong>${subtotal.toFixed(2)} €</strong>
                    `;

                    li.appendChild(info);

                    const removeButton = document.createElement('button');
                    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    removeButton.title = 'Eliminar Producto';
                    removeButton.onclick = () => this.eliminarProducto(isbn);
                    li.appendChild(removeButton);

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