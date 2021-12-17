let user = sessionStorage.getItem("user");
let userJS = JSON.parse(user);
let typeUser;

if (userJS.type == 'ASE') {
    typeUser = "Asesor";
}
else if (userJS.type == 'ADM') {
    typeUser = "Administrador";
}
else if (userJS.type == 'COORD') {
    typeUser = "Coordinador";
}

$("#identification").val(userJS.identification);
$("#name").val(userJS.name);
$("#email").val(userJS.email);
$("#type").val(typeUser);
$("#zone").val(userJS.zone);