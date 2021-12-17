let user = sessionStorage.getItem("user");
let userJS = JSON.parse(user);
let typeUser;
if (user == null) {
    Swal.fire({
        icon: 'error',
        title: 'Sesion caducada',
        text: 'Porfavor inicia sesion nuevamente',
        showConfirmButton: false,
      });
      setTimeout(function () {
        location.href = "../../index.html";
    }, 1500);
} else {
    if (userJS.type == 'ASE') {
        typeUser = "Asesor";
    }
    else if (userJS.type == 'ADM') {
        typeUser = "Administrador";
    }
    else if (userJS.type == 'COORD') {
        typeUser = "Coordinador";
    }
}

$("#identification").val(userJS.identification);
$("#name").val(userJS.name);
$("#email").val(userJS.email);
$("#type").val(typeUser);
$("#zone").val(userJS.zone);