const catalogo = [
    { id: 1, nombre: 'Malbec Reserva', precio: 8500 },
    { id: 2, nombre: 'Cabernet Sauvignon', precio: 9200 },
    { id: 3, nombre: 'Chardonnay', precio: 7800 },
    { id: 4, nombre: 'Rosé', precio: 6500 },
    { id: 5, nombre: 'Pinot Noir', precio: 6500 }
];

function mostrarCatalogo (lista) {
    let catalogo = '=== Catálogo de vinos ===\n\n';
    for (let i = 0; i < lista.length; i++) {
        const producto = lista[i];
        catalogo += `${producto.id}. ${producto.nombre} - $${producto.precio}\n`;
    } 
    const entrada = prompt(
        `${catalogo}\n Ingresá el número del vino (1 a ${lista.length}).\n O presioná "Cancelar" para salir.`
    );
    if (entrada === null) return null;return Number(entrada.trim());         
}

function buscarProductoPorId(lista, idBuscado) {
    for (let i = 0; i < lista.length; i++) {
        const p = lista[i];
        if (p.id === idBuscado) {
            return p
        }
    }
    return null;               
}

function calcularSubtotal(precioUnitario, cantidad) {
    return precioUnitario * cantidad;    
}


function pedirCantidad(nombreProducto) {
    const entrada = prompt(`¿Cuántas unidades de "${nombreProducto}"?`);
    if (entrada === null){
        return null;
    }
    const n = Number(entrada.trim());
    if (!Number.isInteger(n) || n <= 0) {
        return null;
    } else {return n;
    }
}

const quiereComprar = confirm('¿Querés ver el catálogo y elegir un vino?');

if (!quiereComprar) {
    alert('¡Gracias igual! Volvé, cuando quieras!');
} else {
    let seguir = true
    while(seguir){
        const id = mostrarCatalogo(catalogo);
        if (id === null) {
            alert('Operación cancelada. ¡Hasta la próxima!')
            seguir = false
        } else if (!Number.isInteger(id) || id < 1 || id > catalogo.length){
            alert('ID inválido. Debe ser un entero entre 1 y ' + catalogo.length );
        } else {
            const producto = buscarProductoPorId(catalogo, id);
            const cantidad = pedirCantidad(producto.nombre);
            if (cantidad === null) {
                alert('Cantidad cancelada.');
            } else {
                const subtotal = calcularSubtotal(producto.precio, cantidad);
                const ok = confirm(
                    `¿Confirmás la compra?\n\n` +
                    `Producto: ${producto.nombre}\n` +
                    `Precio unitario: $${producto.precio}\n` +
                    `Cantidad: ${cantidad}\n` +
                    `Subtotal: $${subtotal}`
                );
                if(ok){
                    alert('¡Compra confirmada! Gracias por tu pedido.');
                    seguir = confirm('¿Querés comprar otro producto?');
                } else {
                    alert('Operación cancelada.');
                    seguir = false;
                }

            }
        }

    }
}
