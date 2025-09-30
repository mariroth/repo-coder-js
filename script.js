const claveStorage = "carritoV1";
const fmt = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

let catalogo = [];
let carrito = leerCarrito(); 

function leerCarrito() {
    const texto = localStorage.getItem(claveStorage);
    if (texto) {
        return JSON.parse(texto);  
    }
    return [];
}


function guardarCarrito() {
    localStorage.setItem(claveStorage, JSON.stringify(carrito));
}

// 
function toast(msg, variant = "ok") {
    Toastify({
        text: msg,
        duration: 2200,
        gravity: "top",
        position: "right",
        close: true,
        className: `toast-${variant}` 
    }).showToast();
}

function dinero(n) {
  return fmt.format(n);
}


// Catalogo 

async function cargarCatalogo() {
    try {
        const resp = await fetch("productos.json");
        if (!resp.ok) throw new Error("No se pudo cargar el catálogo");
        const data = await resp.json();
        catalogo = data;
        renderCatalogo(catalogo);
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No pudimos cargar el catálogo. Probá recargar o revisar el servidor local.",
            background: "#223049",
            color:      "#f5f7fb",
            iconColor:  "#ef4444",
            confirmButtonColor: "#8b5cf6",
            confirmButtonText: "Entendido",
            allowOutsideClick: false,
            width: "32rem"
        });
    } finally {
        if (loading) loading.remove();
    }
}

function crearCard(prod) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = prod.imagen;
    img.alt = prod.nombre + " " + prod.cepa;
    img.className = "card__img";

    const h3 = document.createElement("h3");
    h3.textContent = prod.nombre + " - " + prod.cepa;

    const bodega = document.createElement("p");
    bodega.className = "muted";
    bodega.textContent = prod.viñedo;

    const precio = document.createElement("p");
    precio.className = "precio";  
    precio.textContent = dinero(prod.precio);

    const btn = document.createElement("button");
    btn.type = "button";

    if (prod.stock) {
        btn.textContent = "Agregar al carrito";
        btn.addEventListener("click", function () {
            agregarAlCarrito(prod.id);
            toast("Producto agregado al carrito", "ok");
        });
    } else {
        btn.textContent = "Sin stock";
        btn.disabled = true;
    }

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(bodega);
    card.appendChild(precio);
    card.appendChild(btn);
    return card;
}

function renderCatalogo(lista) {
    const contCatalogo = document.querySelector("#catalogo");
    const cartelVacio = document.querySelector("#catalogoVacio");

    contCatalogo.innerHTML = "";
    if (!lista || lista.length === 0) {
        cartelVacio.hidden = false;
        return;
    }
    cartelVacio.hidden = true;
    lista.forEach(function (prod) {
        contCatalogo.appendChild(crearCard(prod));
    });
}


// Carrito

function agregarAlCarrito(id) {
    let item = carrito.find(function (e) {
        return e.id === id;
    });
    
    if (item) {
    item.cantidad = item.cantidad + 1;
    } else {
        const prod = catalogo.find(function (p) {
            return p.id === id;
    });
    if (!prod) return;
    
    carrito.push({
    id: prod.id,
    nombre: prod.nombre,
    cepa: prod.cepa,
    precio: prod.precio,
    cantidad: 1
    });
}
guardarCarrito();
renderCarrito();
}



function quitarDelCarrito(id) {
    carrito = carrito.filter(function (elemento) {
        return elemento.id !== id;
    });
    guardarCarrito();
    renderCarrito();
    toast("Producto eliminado", "warn");
}


function cambiarCantidad(id, nuevaCantidad) {
    let item = carrito.find(function (elemento) {
        return elemento.id === id;
    });
    if (!item) return;
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
        quitarDelCarrito(id);
        return;
    }
    item.cantidad = nuevaCantidad;
    guardarCarrito();
    renderCarrito();
    toast("Cantidad actualizada", "info");
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();
    toast("Carrito vacío");
}

function totalCarrito() {
    return carrito.reduce(function (acumulador, elemento) {
        return acumulador + elemento.precio * elemento.cantidad;
    }, 0);
}

function renderCarrito() {
    const contCartItems  = document.querySelector("#cartItems");  
    const cartTotalLabel = document.querySelector("#cartTotal"); 
    const btnFinalizar   = document.querySelector("#btnFinalizar");

    contCartItems.innerHTML = "";
    
    if (carrito.length === 0) {
        contCartItems.innerHTML = '<p class="muted">Tu carrito está vacío.</p>';
        cartTotalLabel.textContent = dinero(totalCarrito());
        btnFinalizar.disabled = true;
        return;
    }
    
    carrito.forEach(function (elemento) {
    const fila = document.createElement("div");
    fila.className = "cart-item";

    const nombre = document.createElement("div");
    nombre.className = "name";
    nombre.textContent = elemento.nombre + " - " + elemento.cepa;

    const controles = document.createElement("div");
    controles.className = "cantidad";

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min  = "0";
    inputCantidad.value = elemento.cantidad;


    inputCantidad.addEventListener("change", function (e) {
        const valor = parseInt(e.target.value || "0", 10);
        cambiarCantidad(elemento.id, valor);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "danger";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
        quitarDelCarrito(elemento.id);
    });

    controles.appendChild(inputCantidad);
    controles.appendChild(botonEliminar);

    const subtotal = document.createElement("div");
    subtotal.className = "subtotal";
    subtotal.textContent = dinero(elemento.precio * elemento.cantidad);

    fila.appendChild(nombre);
    fila.appendChild(controles);
    fila.appendChild(subtotal);

    contCartItems.appendChild(fila);
});

cartTotalLabel.textContent = dinero(totalCarrito());
btnFinalizar.disabled = false;
}


// filtros

function aplicarFiltros() {
    const q = document.querySelector("#buscador").value.toLowerCase().trim();
    const orden = document.querySelector("#orden").value;

    let lista = catalogo.filter(function (p) {
        return  p.nombre.toLowerCase().indexOf(q) !== -1 ||
                p.cepa.toLowerCase().indexOf(q) !== -1;
    });

    switch (orden) {
        case "precio-asc":
            lista.sort(function (a, b) { return a.precio - b.precio; });
            break;
        case "precio-desc":
            lista.sort(function (a, b) { return b.precio - a.precio; });
            break;
        case "nombre-asc":
            lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
            break;
        case "nombre-desc":
            lista.sort(function (a, b) { return b.nombre.localeCompare(a.nombre); });
            break;
    }
    renderCatalogo(lista);
}

// plantilla de comprobante

function abrirComprobanteEnNuevaPestaña({nombre, mail, direccion, items, total }) {
    const payload = { nombre, mail, direccion, items, total };
    sessionStorage.setItem('comp-payload', JSON.stringify(payload));
    window.open('comprobante.html', '_blank');
}

// confirmar compra

async function confirmarCompra(e) {
    e.preventDefault();
    if (carrito.length === 0) {
        await Swal.fire({
            icon:"info",
            title:"Tu carrito está vacío",
            showConfirmButton:false,
            timer:1400
        });
        return;
    }

    const form = document.querySelector("#checkoutForm");
    if (!form.reportValidity()) return;
    const datos = new FormData(form);
    const nombreCliente = datos.get("nombre");
    const mailCliente = datos.get("mail");
    const direccionCliente = datos.get("direccion");
    const total = totalCarrito();
    
    const {isConfirmed} = await Swal.fire({
        title:"Confirmar compra",
        html: `
            <p><b>Cliente:</b> ${nombreCliente || "-"}</p>
            <p><b>Mail:</b> ${mailCliente || "-"}</p>
            <p><b>Dirección:</b> ${direccionCliente || "-"}</p>
            <p><b>Total:</b> ${fmt.format(total)}</p>
            <p>¿Deseás confirmar?</p>
            `,
        icon:"question",
        showCancelButton: true,
        confirmButtonText:"Sí, comprar",
        cancelButtonText:"Cancelar"
    });
    if (!isConfirmed) return;
    const res = await Swal.fire({
        icon:"success",
        title:"¡Gracias por tu compra!",
        text:"¿Querés descargar el comprobante?",
        showCancelButton:true,
        confirmButtonText:"Descargar PDF",
        cancelButtonText:"Cerrar"
    });
    if (res.isConfirmed) {
        const itemsSnapshot = carrito.map(x => ({ ...x })); 
        abrirComprobanteEnNuevaPestaña({
            nombre: nombreCliente,     
            mail: mailCliente,
            direccion: direccionCliente,
            items: itemsSnapshot,
            total: total
        });
    }
    vaciarCarrito();
    form.reset();
}

// inicio
renderCarrito();
cargarCatalogo();

document.querySelector('#btnVaciar').addEventListener('click', vaciarCarrito);
document.querySelector('#checkoutForm').addEventListener('submit', confirmarCompra);
document.querySelector('#buscador').addEventListener('input', aplicarFiltros);
document.querySelector('#orden').addEventListener('change', aplicarFiltros);