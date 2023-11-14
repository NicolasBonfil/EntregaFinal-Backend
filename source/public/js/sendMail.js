const form = document.getElementById("resetPassword")

function ocultarEmail(email) {
    const partes = email.split('@');
    const username = partes[0];
    const dominio = partes[1];
    
    const usernameOculto = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    
    const emailOculto = usernameOculto + '@' + dominio;
    
    return emailOculto;
  }


form.addEventListener("submit", evt => {
    evt.preventDefault()

    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)



    fetch("/api/session/resetPasswordEmail", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if(res.status === 200){
            Swal.fire({
                title:"Correo electrónico enviado",
                html: `Enviamos un correo electrónico a ${ocultarEmail(obj.email)} con un enlace para que recuperes el acceso a tu cuenta.`,
                confirmButtonText: "Aceptar"
            }).then(res => {
                if(res.isConfirmed){
                    window.location.href="/";
                }
            })
        }
    })
})