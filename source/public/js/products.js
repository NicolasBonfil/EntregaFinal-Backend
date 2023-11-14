const agregarAlCarrito = (pid) => {
    obj = {
        pid: pid,
    }

    fetch("/api/carts/products", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    let botonesAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');
    
    botonesAgregarAlCarrito.forEach(function(boton) {
        boton.addEventListener('click', function() {
            let pid = boton.id;
            agregarAlCarrito(pid);
        });
    });
});