function convertirEnPremium(email) {
    obj = {
        email: email,
        accion: "rol"
    }

    fetch("/api/users/adminControl", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
}
  
function eliminarUsuario(email) {
    obj = {
        email: email,
        accion: "eliminar"
    }

    fetch("/api/users/adminControl", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    let botonesConvertirPremium = document.querySelectorAll('.convertir-en-premium');
    let botonesEliminarUsuario = document.querySelectorAll('.eliminar-usuario');

    botonesConvertirPremium.forEach(function(boton) {
        boton.addEventListener('click', function() {
            let email = boton.id;
            convertirEnPremium(email);
        });
    });

    botonesEliminarUsuario.forEach(function(boton) {
        boton.addEventListener('click', function() {
            let email = boton.id;
            eliminarUsuario(email);
        });
    });
});
  