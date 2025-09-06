const catalogo = [
    { 
        id: 1, 
        nombre: "Alambrado", 
        cepa: "Malbec Reserva", 
        viñedo: "Las Perdices", 
        precio: 8500,  
        stock: true, 
        imagen: "/img/alambradoMalbec.png" 
    },
    { 
        id: 2, 
        nombre: "Norton Select", 
        cepa: "Cabernet Sauvignon",
        viñedo: "Bodega Norton", 
        precio: 11500, 
        stock: true, 
        imagen: "/img/nortonSelectCavernetSauvignon.png" 
    },
    { 
        id: 3, 
        nombre: "Paula", 
        cepa: "Chardonay", 
        viñedo: "Doña Paula", 
        precio: 8500,  
        stock: true, 
        imagen: "/img/paulaChardonnay.png" 
    },
    { 
        id: 4, 
        nombre: "Emilia", 
        cepa: "Rosé", 
        viñedo: "Nieto Senetiner", 
        precio: 8500,  
        stock: true, 
        imagen: "/img/emilia_Rose.png" 
    },
    { 
        id: 5, 
        nombre: "Nieto Senetiner", 
        cepa: "Pinot Noir", 
        viñedo: "Nieto Senetiner",
        precio: 11500, 
        stock: true, 
        imagen: "/img/nietoSenetinerPinotNoir.png" 
    },
    { 
        id: 6, 
        nombre: "Ala Colorada", 
        cepa: "Cabernet Franc", 
        viñedo: "Las Perdices", 
        precio: 11500, 
        stock: false, 
        imagen: "/img/alaColoradaCabernetFranc.png" 
    },
    { 
        id: 7, 
        nombre: "Alaris", 
        cepa: "Cabernet Sauvignon Blanco", 
        viñedo: "Trapiche", 
        precio: 10500, 
        stock: true, 
        imagen: "/img/alarisCabernetBlanco.png" 
    },
    { 
        id: 8, 
        nombre: "Los Cardps", 
        cepa: "Cabernet Sauvignon Blanco", 
        viñedo: "Doña Paula", 
        precio: 9900,  
        stock: true,
        imagen: "/img/losCardosDoñaPaula.png" 
    }
];


const claveStorage = "carritoV1";
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


// Catalogo 

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
    precio.textContent = "$ " + prod.precio;

    const btn = document.createElement("button");
    btn.type = "button";

    if (prod.stock) {
        btn.textContent = "Agregar al carrito";
        btn.addEventListener("click", function () {
            agregarAlCarrito(prod.id);
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
    let item = carrito.find(function (elemento) {
        return elemento.id === id;
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
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();
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
        cartTotalLabel.textContent = "$ " + totalCarrito();
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
    subtotal.textContent = "$ " + (elemento.precio * elemento.cantidad);

    fila.appendChild(nombre);
    fila.appendChild(controles);
    fila.appendChild(subtotal);

    contCartItems.appendChild(fila);
});

cartTotalLabel.textContent = "$ " + totalCarrito();
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

// confirmar compra

function confirmarCompra() {
    if (carrito.length === 0) return;
    
    const datosFormulario = new FormData(document.querySelector("#checkoutForm"));
    const nombreCliente = datosFormulario.get("nombre");
    const emailCliente = datosFormulario.get("email");
    const direccionCliente = datosFormulario.get("direccion");
    const montoTotal = totalCarrito();
    
    alert(
    "¡Gracias " + nombreCliente + "! " +
    "Total de la compra: $ " + montoTotal +
    ". Te enviamos el detalle a: " + emailCliente
    );
    
    vaciarCarrito();
    document.querySelector('#checkoutForm').reset();
}

// inicio

renderCatalogo(catalogo);
renderCarrito();
document.querySelector('#btnVaciar').addEventListener('click', vaciarCarrito);
document.querySelector('#checkoutForm').addEventListener('submit', confirmarCompra);
document.querySelector('#buscador').addEventListener('input', aplicarFiltros);
document.querySelector('#orden').addEventListener('change', aplicarFiltros);
