import nodemailer from "nodemailer" //se instalo nodemailer

export const emailRegistro = async (datos) => {
    const {nombre,email,token} = datos 
    
    //configuracion de la pagina mailtrap para vinvularlo con nodemailer
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f6cbe453b5dcbd",
            pass: "6adce2c51d7375"
        }
    });

    //informacion del email

    const info = await transport. sendMail({
        from: ' "Protask - Administrador de Proyectos" <cuentas@protask.com>' ,
        to: email,
        subject: "Protask - Comprueba tu cuenta",
        text: "Comprueba tu cunta en Protask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Protask</p> 
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p> 
        
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar Cuenta</a>
        
        <p>SI tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `,
    })
}

export const emailOlvidoPassword = async (datos) => {
    const {nombre,email,token} = datos 
    
    //configuracion de la pagina mailtrap para vinvularlo con nodemailer
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f6cbe453b5dcbd",
            pass: "6adce2c51d7375"
        }
    });

    //informacion del email

    const info = await transport. sendMail({
        from: ' "Protask - Administrador de Proyectos" <cuentas@protask.com>' ,
        to: email,
        subject: "Protask - Cambiar Contraseña",
        text: "Comprueba tu cunta en Protask",
        html: `<p>Hola: ${nombre} solicitaste recuperar tu contraseña para acceder a tu cuenta de Protask </p> 
        <p>Recupera l acceso a tu cuenta dando click en este link:</p> 
        
        <a href="${process.env.FRONTEND_URL}/nuevo-password/${token}">Recuperar Contraseña</a>
        
        <p>SI tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `,
    })
}