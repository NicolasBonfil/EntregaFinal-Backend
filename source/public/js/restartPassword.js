const form = document.getElementById("resetPassword")

form.addEventListener("submit", evt => {
    evt.preventDefault()

    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)

    fetch("/api/session/resetPassword",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => {
        if(res.status === 200){
            Swal.fire({
                title:"Cambiaste tu contraseña satifactoriamente",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(res => {
                if(res.isConfirmed){
                    window.location.href="/";
                }
            })
        }
    })
})