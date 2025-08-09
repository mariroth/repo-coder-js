const IVA = 0.21;
const catalogo = [
    { id: 1, nombre: 'Malbec Reserva', precio: 8500 },
    { id: 2, nombre: 'Cabernet Sauvignon', precio: 9200 },
    { id: 3, nombre: 'Chardonnay', precio: 7800 },
    { id: 4, nombre: 'Rosé', precio: 6500 },
    { id: 5, nombre: 'Pinot Noir', precio: 6500 },
    { id: 6, nombre: 'Sauvignon Blanc', precio: 6760 },
    { id: 7, nombre: 'Merlot', precio: 7500 },
    { id: 8, nombre: 'Cabernet Franc', precio: 11500 },
    { id: 9, nombre: 'Syrah', precio: 4568 },
    { id: 10, nombre: 'Bonarda', precio: 4568 },
];

const cantidades = {};

function descuentoPorTramo(subtotal) {
    if (subtotal > 70000) return 0.15;
    if (subtotal > 50000) return 0.10;
    if (subtotal > 30000) return 0.05;
    return 0;
}

function actualizarResumen() {
    let subtotal = 0;
    for (const prod of catalogo) {
    const cant = cantidades[prod.id] || 0;
    subtotal = subtotal + (prod.precio * cant);
    }

    const descPct = descuentoPorTramo(subtotal);
    const descMonto = subtotal * descPct;
    const neto = subtotal - descMonto;
    const iva = neto * IVA;
    const total = neto + iva;


    document.getElementById('r-subtotal').textContent = `$${subtotal}`;
    document.getElementById('r-descuento').textContent = `$${descMonto.toFixed(2)}`;
    document.getElementById('r-desc-pct').textContent = descPct > 0 ? `(${(descPct*100).toFixed(0)}%)` : '';
    document.getElementById('r-iva').textContent = `$${iva.toFixed(2)}`;
    document.getElementById('r-total').textContent = `$${total.toFixed(2)}`;
}

function renderProductos() {
    const contenedorProductos = document.getElementById('lista-productos');
    contenedorProductos.innerHTML = '';

    catalogo.forEach((prod) => {
    const div = document.createElement('div');
    div.className = 'prod';
    cantidades[prod.id] = 0;

    div.innerHTML = `
    <h3>${prod.nombre}</h3>
    <div class="precio">Precio: <strong>$${prod.precio}</strong></div>
    <div class="row">
    <label>Cantidad</label>
    <input type="number" min="0" value="0" />
    </div>
    <div class="subprod">
        Subtotal producto: <strong class="subtotal-texto">$0</strong>
    </div>
    `;

    const input = div.querySelector('input');               
    const elementoSubtotal = div.querySelector('.subtotal-texto');

    input.addEventListener('input', () => {
        const cant = parseInt(input.value, 10);
        const cantidadValida = isNaN(cant) || cant < 0 ? 0 : cant;
        cantidades[prod.id] = cantidadValida;
        const subProd = prod.precio * cantidadValida;
        elementoSubtotal.textContent = `$${subProd}`;
        actualizarResumen();
    });

    contenedorProductos.appendChild(div);
});
}


document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    actualizarResumen();
    
    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) {
    btnConfirmar.addEventListener('click', confirmarCompra);
}
});

function confirmarCompra() {
    let subtotal = 0;
    for (const prod of catalogo) {
    const cant = cantidades[prod.id] || 0;
    subtotal += prod.precio * cant;
}

if (subtotal === 0) {
    alert('No agregaste productos.');
    return;
}

const ok = confirm('¿Confirmás la compra?' );
if (!ok) return;

alert('🎉 ¡Gracias por tu compra!');
renderProductos();
actualizarResumen();
}

