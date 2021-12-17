const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    password: /^([\da-zA-Z_\.-]){4,12}$/, //4-12 caracteres
    email: /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ // email; El email solo puede contener letras, numeros, puntos, guiones y guion bajo
}

const campos = {
    password: false,
    email: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "email":
            validarCampo(expresiones.email, e.target, 'email');
            break;

        case "password":
            validarCampo(expresiones.password, e.target, 'password');
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`${campo}`).classList.remove('is-invalid')
        document.getElementById(`${campo}`).classList.add('is-valid')
        campos[campo] = true;
    } else {

        document.getElementById(`${campo}`).classList.remove('is-valid')
        document.getElementById(`${campo}`).classList.add('is-invalid')
        campos[campo] = false;
    }
};

if (formulario != null) {
    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        // Cuando el formulario esta correcto
        if (campos.email && campos.password == true) {
            var email = $("#email").val();
            var password = $("#password").val();
            formulario.reset();
            document.querySelectorAll('#formulario input').forEach((icono) => {
                icono.classList.remove('is-valid');
                icono.classList.remove('is-invalid');
            });
            ingresar(email, password);

        } else {
            // Ejecutar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Formulario incorrecto',
                text: 'Por favor rellenar el formulario correctamente'
            });
        }

    });
}

/* ----- -----  Funcion Ajax para consultar por email y password----- -----  */
function ingresar(email, password) {

    $.ajax({
        dataType: 'json',
        url: "http://localhost:8080/api/user/" + email + "/" + password,
        type: "GET",

        success: function (response) {
            if (response.id == null) {
                Swal.fire({
                    icon: 'error',
                    title: 'No existe un usuario'
                });
            } else {
                //crea objeto javascript que contiene la información del usuario
                let userJS = {
                    id: response.id,
                    identification: response.identification,
                    name: response.name,
                    birthtDay: response.birthtDay,
                    monthBirthtDay: response.monthBirthtDay,
                    address: response.address,
                    cellPhone: response.cellPhone,
                    email: response.email,
                    password: response.password,
                    zone: response.zone,
                    type: response.type
                };

                //transforma el objeto javascript a json antes de guardarlo en el sessionStorage
                let user = JSON.stringify(userJS);

                //almacena el usuario en el sessionStorage, para hacerlo disponible a las otras páginas
                sessionStorage.setItem("user", user);

                if (response.type == 'ADM') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Bienvenido(a) ' + response.name,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(function () {
                        location.href = "../ADM/tablaAdm.html";
                    }, 1000);

                } else if (response.type == 'ASE') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Bienvenido(a) ' + response.name,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(function () {
                        location.href = "../ASE/tablaAse.html";
                    }, 1000);
                } else if (response.type == 'COORD') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Bienvenido(a) ' + response.name,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(function () {
                        location.href = "../COORD/tablaCoord.html";
                    }, 1000);
                }
            }
        },

        error: function (jqHRX, textStatus, errorThrown) {
            Swal.fire({
                title: '<strong>Algo fallo</strong>',
                icon: 'error',
                html:
                    '<iframe src="https://giphy.com/embed/8L0Pky6C83SzkzU55a" width="280" height="150" ></iframe><p>Ingreso fallido</p>'
            });
        }
    });

}
