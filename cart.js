class Cart {
    constructor() {
        this.items = {};
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
        this.actualizarVista();
    }

    eliminarProducto(isbn) {
        delete this.items[isbn];
        this.actualizarVista();
    }

    vaciarCarrito() {
        this.items = {};
        this.actualizarVista();
    }

    actualizarVista() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        cartItems.innerHTML = '';
        let total = 0;

        for (const isbn in this.items) {
            const li = document.createElement('li');
            li.textContent = `ISBN: ${isbn} - Cantidad: ${this.items[isbn]}`;

            // Botón para eliminar producto con icono
            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Icono de Font Awesome
            removeButton.title = 'Eliminar Producto'; // Descripción al pasar el mouse
            removeButton.onclick = () => this.eliminarProducto(isbn);
            li.appendChild(removeButton);

            cartItems.appendChild(li);
            total += this.items[isbn];
        }

        cartTotal.textContent = total;
    }
}