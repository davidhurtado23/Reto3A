//almacena la totalidad de los productos
let productos = [];
//almacena solamente los productos seleccionados
let productosSeleccionados = [];
//almacena la cantidad seleccionada x cada producto
let cantidades = [];

let user = sessionStorage.getItem("user");

function traerInformacionProductos() {
    $("#procesarOrden").hide();
    $("#btnBorrar").show();
    $("#btnBorrar").hide();
    $("#pedido").hide();
    $("#pedido").html("");

    $.ajax({
        url: "http://localhost:8080/api/fragance/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            pintarRespuesta(respuesta);
        }
    });
}

function pintarRespuesta(respuesta) {
    productos = respuesta;

    let myTable = "<table>";

    for (let index = 0; index < respuesta.length; index++) {

        let texto = `<strong>Referencia:</strong> ${respuesta[index].reference}</br><strong>Descripción:</strong> ${respuesta[index].description}`;

        let availability = respuesta[index].availability ? 'Si' : 'No';

        myTable += `<tr>
                  <td>${respuesta[index].reference}</td>
                  <td>${respuesta[index].brand}</td>
                   <td>${respuesta[index].category}</td>
                   <td>${respuesta[index].presentation}</td>
                   <td>${respuesta[index].description}</td>
                   <td>${availability}</td>
                   <td>${respuesta[index].price}</td>
                   <td><input type="number" id="prod_${respuesta[index].reference}"/ ></td>
                   <td><button class="btn btn-success" id="bot_${respuesta[index].reference}" onclick="registrarproducto('${index}')">Agregar</button></td>
                    </td>
                   </tr>`;
    }
    myTable += "</table>";
    $("#resultado3").html(myTable);

}

function registrarproducto(indice) {
    //Obtengo la referencia del producto
    let referencia = productos[indice].reference;

    //el ide de la caja de datos esta formado por la palabra prod + _ + la referencia del producto
    let idCaja = `prod_${referencia}`;
    //se utilizan para validar si el producto fue previamente adicionado al arreglo de productos seleccionados
    let index = 0;
    let encontro = false;

    cantidadProducto = parseInt(document.getElementById(idCaja).value);

    if (isNaN(cantidadProducto) || cantidadProducto <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no valida',
            text: 'La cantidad a solicitar debe ser un valor mayor a 0.'
        });
        document.getElementById(idCaja).focus();
        return;
    } else {
        $("#procesarOrden").show();
        $("#btnBorrar").show();
        //convierte en entero el dato que se ingresa en la caja de texto
        cantidadProducto = parseInt(document.getElementById(idCaja).value);
    }

    //Valido si previamente existe el producto en el arreglo de cantidades, obtiene la cantidad previa y suma la nueva cantidad
    for (index = 0; index < productosSeleccionados.length; index++) {
        if (productosSeleccionados[index].reference == referencia) {
            encontro = true;
            break;
        }
    }

    //si encontro el producto entre los seleccionados, suma la cantidad solicitada a la cantidad de producto
    //o agrega el producto y la cantidad solicitada a los respectivos arreglos
    if (encontro) {
        cantidades[index] = cantidades[index] + cantidadProducto;
    } else {
        cantidades.push(cantidadProducto);
        productosSeleccionados.push(productos[indice]);
    }

    //limpio cantidad de producto y asigno el cursor sobre el campo
    document.getElementById(idCaja).value = "";
    document.getElementById(idCaja).focus();

    pintarPedido();
}

/**
 * Crea una tabla hmtl con los productos seleccionado y sus cantidades
 */
function pintarPedido() {

    let tabla = document.querySelector("#pedido");
    let subtotal = 0;
    tabla.innerHTML = "";

    for (let indice = 0; indice < productosSeleccionados.length; indice++) {

        tr = document.createElement("tr")
        tdReference = document.createElement("td")
        tdPrice = document.createElement("td")
        tdCantidad = document.createElement("td")
        tdsubTotal = document.createElement("td")
        precio = parseInt(productosSeleccionados[indice].price);
        cantidad = parseInt(cantidades[indice]);

        tdReference.innerHTML = productosSeleccionados[indice].reference;
        tdPrice.innerHTML = productosSeleccionados[indice].price;
        tdCantidad.innerHTML = cantidades[indice]
        tdsubTotal.innerHTML = (precio * cantidad);

        tr.appendChild(tdReference);
        tr.appendChild(tdPrice);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdsubTotal);
        tabla.appendChild(tr);

        subtotal = subtotal + precio * cantidad;
    }
    tr = document.createElement("tr");
    tdsubTotal = document.createElement("td")
    tdTitulo = document.createElement("th")
    tdsubTotal.innerHTML = subtotal;
    tdTitulo.innerHTML = "Total";
    tr.appendChild(tdTitulo).colSpan = "3";
    tr.appendChild(tdsubTotal);
    tabla.appendChild(tr);

    $("#pedido").show();
    $("#procesarOrden").show();
    $("#btnBorrar").show();
    $("#procesarOrden").click(function () {
        procesarOrden();
    });
    $("#btnBorrar").click(function () {
        location.reload();
    });
}


function procesarOrden() {
    //obtengo del sessionStorage el objeto user, el cual corresponde al usuario autenticado
    let user = sessionStorage.getItem("user");
    let orderDate = new Date();

    //pasar de JSON a JS
    let userJs = JSON.parse(user);


    let productos = {};
    let quantities = {};


    for (let i = 0; i < productosSeleccionados.length; i++) {
        productos[productosSeleccionados[i].reference] = productosSeleccionados[i];
        quantities[productosSeleccionados[i].reference] = cantidades[i];
    }

    let order = {
        registerDay: orderDate.toISOString(),
        status: "Pendiente",
        salesMan: userJs,
        products: productos,
        quantities: quantities
    }

    let orderJson = JSON.stringify(order);

    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: "http://localhost:8080/api/order/new",
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        //si el metodo del servicio recibe datos, es necesario definir el parametro adicional
        data: orderJson,

        // especifica el tipo de petición http: POST, GET, PUT, DELETE
        type: 'POST',

        contentType: "application/JSON",

        // el tipo de información que se espera de respuesta
        //dataType: 'json',

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (respuesta) {
            console.log(respuesta)
            productosSeleccionados = [];
            cantidades = [];
            traerInformacionProductos();
            Swal.fire({
                icon: 'success',
                title: 'Solicitud de pedido exitosa',
                text: 'Codigo de pedido #'+respuesta.id+'. pedido procesado correctamente.'
            });
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            Swal.fire({
                title: '<strong>Algo fallo</strong>',
                icon: 'error',
                html:
                    '<iframe src="https://giphy.com/embed/8L0Pky6C83SzkzU55a" width="280" height="150" ></iframe><p>Fallo al editar producto ' + status + '</p>'
            });
        }
    });

}
