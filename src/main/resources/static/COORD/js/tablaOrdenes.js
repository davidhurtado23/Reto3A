let userZona;
let orders = [];
let salesman = {};
let oderId;

function estadoInicial() {
    // $("#alerta").hide();
    $("#detalleOrden").hide();
    // $("#procesarOrden").hide();
    // $("#pedido").html("");
    $("#listado").hide();

    let user = sessionStorage.getItem("user");
    let userJS = JSON.parse(user);
    userZona = userJS.zone;

    // if (user == null) location.href = "index.html";
    // else {
    //     let userJS = JSON.parse(user);
    //     userZona = userJS.zone;
    //     let typeUser;

    //     if (userJS.type == "COORD") typeUser = "COORDINADOR";
    //     else location.href = "index.html";

    //     $("#nameUser").html(userJS.name);
    //     $("#emailUser").html(userJS.email);
    //     $("#typeUser").html(typeUser);
    // }
    listar();
}

function listar() {
    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: `http://localhost:8080/api/order/zona/${userZona}`,

        // especifica el tipo de petición http: POST, GET, PUT, DELETE
        type: "GET",

        // el tipo de información que se espera de respuesta
        dataType: "json",

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (respuesta) {
            //recibe el arreglo 'items' de la respuesta a la petición
            listarProductos(respuesta);
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            $("#alerta").html(
                "Ocurrio un problema al ejecutar la petición..." + status
            );
        },
    });
}

function listarProductos(items) {
    //almacena las ordenes
    orders = items;

    let myTable = ` <div class="card">
        <div class="card-header">
            <h4>Ordenes asesores comerciales</h4>
        </div>
        <div class="card-body">
        <table class="table table-bordered table-hover table-striped">
            <thead class="thead-light">
                <tr class="text-center">
                    <th scope="col">Identificación</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">No. Pedido</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Pedido</th>
                </tr>
            </thead>

            <tbody class="text-center">`;

    //recorrer el arreglo de items de producto para pintarlos en la myTable
    for (let i = 0; i < orders.length; i++) {
        let orderDate = orders[i].registerDay;
        let ocurrence = orderDate.indexOf("T");
        orderDate = orderDate.substring(0, ocurrence);
        salesMan = orders[i].salesMan;

        myTable += `<tr>
                <td>${salesMan.identification}</td>
                <td>${salesMan.name}</td>
                <td>${salesMan.email}</td>
                <td>${orderDate}</td>
                <td>${orders[i].id}</td>
                <td>${orders[i].status}</td>
                <td><button class="btn btn-outline-success" id="ped_${orders[i].id}" onclick="detalleOrden(${i})">Ver pedido</button></</td>
            </tr>`;
    }

    //cierra myTable agregando el tag adecuado
    myTable += `</tbody>
            </table>
        </div>
    </div>`;

    //accede al elemento con id 'listado' y adiciona la myTable de datos a su html
    $("#listado").html(myTable);
    $("#listado").show(1000);
}

function detalleOrden(indice) {
    let order = orders[indice];
    let products = [];
    let quantities = [];
    let objeto;
    let objetoCantidad;

    oderId = order.id;

    $("#listado").hide(500);

    //recupero los productos y cantidades de producto en la orden
    products = order.products;
    quantities = order.quantities;

    //construyo tabla de encabezado
    let tabla = `<div class="card">
    <div class="card-header text-start">
        <h4>Asesores comercial</h4>
    </div>

    <div class="card-body">
        <table class="table table-bordered table-hover table-striped">
            <thead class="thead-light">
                <tr>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Id</th>
                    <th>Estado</th>                                        
                </tr>
            </thead>

            <tbody class="text-center">`;


    let orderDate = order.registerDay;
    let ocurrence = orderDate.indexOf("T");
    orderDate = orderDate.substring(0, ocurrence);
    salesMan = order.salesMan;

    tabla += `<tr>
                    <td>${salesMan.identification}</td>
                    <td>${salesMan.name}</td>
                    <td>${salesMan.email}</td>
                    <td>${orderDate}</td>
                    <td>${order.id}</td>
                    <td>${order.status}</td>
                </tr>`;


    //cierra tabla agregando el tag adecuado
    tabla += `</tbody>
            </table>
        </div>`;


    //construyo la tabla de productos
    let tablaProductos = tabla + `<div class="card mt-4">
    <div class="card-header text-start">
        <h4>Producto</h4>
    </div>
    <div class="card-body">
    <table class="table table-bordered table-hover table-striped">
        <thead class="thead-light">
            <tr>
                <th>Referencia</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Descripcción</th>
                <th>Precio</th>
                <th>Cantidad</th>
            </tr>
        </thead>

    <tbody class="text-center">`;

    for (let property in products) {
        objeto = products[property];
        objetoCantidad = quantities[property];

        tablaProductos += `<tr>
        <td>${objeto.reference}</td>
         <td>${objeto.category}</td>
         <td>${objeto.brand}</td>
         <td>${objeto.description}</td>
         <td>${objeto.price}</td>
         <td>${objetoCantidad}</td>
      </tr>`;
    }

    //cierra tabla agregando el tag adecuado
    tablaProductos += `</tbody>
        </table>
    </div>`;

    //accede al elemento con id 'listado' y adiciona la tabla de datos a su html
    $("#orden").html(tablaProductos);
    $("#detalleOrden").show(1000);
}

function actualizarEstadoOrden() {
    let estadoOrden = $("#estadoOrden").val();

    //crea un objeto javascript
    let datos = {
        id: oderId,
        status: estadoOrden
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: `http://localhost:8080/api/order/update`,

        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        //si el metodo del servicio recibe datos, es necesario definir el parametro adicional
        data: datosPeticion,

        // especifica el tipo de petición http: POST, GET, PUT, DELETE
        type: 'PUT',

        contentType: "application/JSON",

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (respuesta) {
            //recibe el arreglo 'items' de la respuesta a la petición
            estadoInicial()
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            $("#alerta").html(
                "Ocurrio un problema al ejecutar la petición..." + status
            );
        },
    });
}

$(document).ready(function () {
    //ejecuta función para enviar petición al ws
    estadoInicial();

    //si hizo clic en el enlace de cerrar sesion
    $("#cerrarSession").click(function () {
        sessionStorage.removeItem("user");
        location.href = "index.html";
    });

    //si hizo clic en el enlace de cerrar sesion
    $("#cancelarDetalle").click(function () {
        $("#detalleOrden").hide(1000);
        $("#listado").show(1000);
    });

    //si hizo clic en el enlace de cerrar sesion
    $("#actualizarOrden").click(function () {
        actualizarEstadoOrden();
    });
});

