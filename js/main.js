//array de productos:
const tienda = [
    {
        id: 1,
        nombre: "Volkswagen Polo",
        precio: 10500.0,
        img: "polo.png",
    },
    {
        id: 2,
        nombre: "laptop Dell Inspiron",
        precio: 12000.0,
        img: "Dell2.jpeg",
    },
    { id: 3, nombre: "audifonos hp", precio: 800.0, img: "audifonoshp2.jpeg" },
    { id: 4, nombre: "bocinas usb", precio: 1200.0, img: "bocinas.jpg" },
    { id: 5, nombre: "motorola g14", precio: 5000, img: "moto-g14.jpg" },
    { id: 6, nombre: "i-pad pro max", precio: 15000.0, img: "ipad.jpeg" },
    { id: 7, nombre: "monitor gamer", precio: 6000.0, img: "monitor gamer.jpg" },
    { id: 8, nombre: "Laptop HP Pavillion", precio: 8000.0, img: "lapHP.jpeg" },
];

//SELECCIONAR LOS ELEMENTOS CON LOS QUE VAMOS A TRABAJAR:

const inputIngreso = document.querySelector("#ingreso"); //input ingreso
const btnSearch = document.querySelector("#btnSearch"); //boton buscar:
const btnMostrar = document.querySelector("#btnMostrar"); //boton mostrar carrito
const btnLimpiarCarrito = document.querySelector("#btnQuitar"); //boton limpiar carrito
const btnPagar = document.querySelector("#btnPagar"); //boton pagar carrito
const contenedor = document.querySelector("#contenedor"); //<div> donde se almacenaran las tarjetas de forma dinamica.
const contenedorPago = document.querySelector("#contenedor-pago"); //<div> donde se muestra el total a pagar por el carrito.
//Se inicializa totalPagar en local storage con valor cero si aun no exiate. Y se llama dentro de la funcion quitarDelCarrito:
if (!localStorage.getItem("totalPagar")) {
    localStorage.setItem("totalPagar", JSON.stringify(0));
}

//array vacio. Se va llenando con los productos que elige el usuario.
const carrito = []; //carrito de compras

//FUNCIONES:

//Funcion para filtrar producto:
function filtrarProducto(arr, filtro) {
    const filtrado = arr.filter((el) => {
        return el.nombre.toLowerCase().includes(filtro.toLowerCase());
    });

    return filtrado;
}

//Funcion para agregar un producto al carrito:
function agregarAlCarrito(event) {
    console.log("Agregando al carrito");
    const productoId = parseInt(event.target.getAttribute("data-id"));
    const productoSeleccionado = tienda.find(
        (producto) => producto.id === productoId
    );

    if (productoSeleccionado) {
        //verificar si el servicio o producto ya esta en el carrito:
        const existeEnCarrito = carrito.some((item) => item.id === productoId);

        if (existeEnCarrito) {
            //si ya esta en el carrito incrementa la cantidad:
            carrito.forEach((item) => {
                if (item.id === productoId) {
                    item.cantidad++;
                }
            });
        } else {
            //si no esta en el carrito agregarlo con cantidad 1:
            carrito.push({ ...productoSeleccionado, cantidad: 1 });
        }
        //guardar carrito actualizado en LS:
        localStorage.setItem("carrito", JSON.stringify(carrito));
        //volver a renderizar las tarjetas de productos:
    }
}

//---FUNCION PARA QUITAR UN PRODUCTO DEL CARRITO:---
function quitarDelCarrito(event) {
    const productoId = parseInt(event.target.getAttribute("data-id"));
    const indice = carrito.findIndex((item) => item.id === productoId);

    if (indice !== -1) {
        //Restar el precio del producto que se quita del carrito:
        const precioRestado = carrito[indice].precio * carrito[indice].cantidad;
        let totalPagar = calcularPagoTotal(carrito);

        //Restar el precio del producto eliminado del total a pagar:
        totalPagar -= precioRestado;

        carrito.splice(indice, 1); // Elimina el producto del carrito
        localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el localStorage
        crearHtml(carrito); // Vuelve a renderizar el carrito
        contenedorPago.innerHTML = `<p>Total del carrito: $${totalPagar}.00</p>`;

        localStorage.setItem("totalPagar", JSON.stringify(totalPagar)); //actualiza el total a pagar en el LS
        console.log(totalPagar);
    }
}

//FUNCION AGREGAR EVENTOS:
//Evento click en los botones "Agregar" y "quitar" de las tarjetas de producto:
function agregarEventos() {
    const agregarBtns = document.querySelectorAll(".agregar-btn");
    const quitarBtns = document.querySelectorAll(".quitar-btn");

    agregarBtns.forEach((btn) => {
        btn.addEventListener("click", agregarAlCarrito);

        /* TOASTIFY*/
        btn.addEventListener("click", (event) => {
            const productoId = parseInt(event.target.getAttribute("data-id"));
            const productoSeleccionado = tienda.find(
                (producto) => producto.id === productoId
            );

            if (productoSeleccionado) {
                Toastify({
                    text: `${productoSeleccionado.nombre} agregado al carrito`,
                    duration: 2500,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "#1f561f",
                    },
                }).showToast();
            }
        });
    });

    quitarBtns.forEach((btn) => {
        btn.addEventListener("click", quitarDelCarrito);
    });
}

// Función para crear estructura html:
//se declara mostrarBotonAgregar = true, pero cuando un producto se agrega al carrito, esto cambia a false para que la tarjeta de producto solo tenga el boton "quitar":
function crearHtml(arr, mostrarBotonAgregar = true) {
    contenedor.innerHTML = "";

    //La funcion se ejecuta solo si el array no esta vacio.
    if (arr && arr.length > 0) {
        //Desestructuracion del objeto en la funcion::
        for (const el of arr) {
            const { img, nombre, precio, id } = el;
            const html = `
        <div class="card">
        <img src=" ../img/${img}" alt="${nombre}">
        <hr>
        <h3>${nombre}</h3>
        <p>Precio: $${precio} </p>
        <div class="card-action">
        ${mostrarBotonAgregar
                    ? `<button class="btn btn-success agregar-btn" data-id="${id}">Agregar</button>`
                    : ""
                }
        ${
                //si el producto se agrega al carrito, adquiere un boton 'quitar':
                carrito.some((el) => el.id === id)
                    ? `<button class="btn btn-danger quitar-btn" data-id="${id}">Quitar</button>`
                    : ""
                }     
        </div>
        </div>`;
            //Agregar al contenedor:
            contenedor.innerHTML += html;
        }
        agregarEventos(); //agrega eventos despues de crear todas las tarjetas HTML.
    } else {
        //si no hay productos agregados al array, la funcion muestra el sig. mensaje:
        contenedor.innerHTML = "<p>Aun no has agregado productos al carrito</p>";
    }
}

crearHtml(tienda);

//Agregar una escucha de evento click al boton "buscar":
btnSearch.addEventListener("click", () => {
    //validar minimo 4 letras en el campo de entrada:
    if (inputIngreso.value.length >= 4) {
        const filtrado = filtrarProducto(tienda, inputIngreso.value);
        crearHtml(filtrado);
        if (filtrado.length === 0) {
            contenedor.innerHTML = "<p>No se encontraron productos</p>";
        }
    } else {
        //las tarjetas de producto se muestran aunque el usuario no realice una busqueda especifica:
        crearHtml(tienda);
    }
});

//boton "ver carrito" los productos agregados al carrito solo tienen el boton "quitar" y no se pueden agregar de nuevo dentro del carrito:
btnMostrar.addEventListener("click", () => {
    const carritoDesdeLS = JSON.parse(localStorage.getItem("carrito"));
    crearHtml(carritoDesdeLS, false); //false

    //Calcular pago:
    const total = calcularPagoTotal(carritoDesdeLS);
    contenedorPago.innerHTML = `<p>Total del carrito: $${total}.00</p>`;
    console.log(total);
});

//3.-Agregar una escucha de evento click al boton "limpiar carrito":
btnLimpiarCarrito.addEventListener("click", () => {
    contenedor.innerText = "Tu carrito esta limpio";
    (contenedorPago.innerHTML = ""), localStorage.removeItem("carrito");
}); //el carrito se borra del almacenamiento local
//Funcion anterior para calcular el pago total:
function calcularPagoTotal(array) {
    return array.reduce((acc, elemento) => {
        //Si elemento.cantidad no tiene un valor, asumir 1:
        const cantidad = elemento.cantidad || 1;
        return acc + elemento.precio * cantidad;
    }, 0);
}

// Evento click en el botón Pagar
btnPagar.addEventListener("click", () => {
    const carritoDesdeLS = JSON.parse(localStorage.getItem("carrito"));
    //Verificar si el carrito esta vacio:
    if (!carritoDesdeLS || carritoDesdeLS.length === 0) {
        //no hacer nada si el carrito esta vacio:
        return;
    }
    const total = calcularPagoTotal(carritoDesdeLS);
    (contenedorPago.innerHTML = ""), localStorage.removeItem("carrito");

    Swal.fire({
        title: "Compra exitosa",
        text: `Total pagado: $${total}`,
        icon: "success",
    });
});
