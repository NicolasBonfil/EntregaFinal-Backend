const eliminarDelCarrito = (pid) => {
    obj = {
        pid: pid,
    }

    fetch("/api/carts/products", {
        method: "DELETE",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    let botonesEliminarDelCarrito = document.querySelectorAll('.eliminar-del-carrito');
    
    botonesEliminarDelCarrito.forEach(function(boton) {
        boton.addEventListener('click', function() {
            let pid = boton.id;
            eliminarDelCarrito(pid);
        });
    });
});

const vaciarCarrito = document.getElementById("vaciar-carrito")

vaciarCarrito.addEventListener("click", () => {
    fetch("/api/carts", {
        method: "DELETE",
    })
})