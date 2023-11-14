import { HTTP_STATUS } from "../utils/responses.js"

const authorized = () => {
    return (req, res, next) => {
        if(!req.user){
			return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: "No authenticated"})
		}

        const nombres = []
        req.user.documents.forEach(f => nombres.push(f.name))

        if((!nombres.includes('Identificacion') || !nombres.includes('Comprobante de domicilio') || !nombres.includes('Comprobante de estado de cuenta'))){
            return res.status(HTTP_STATUS.FORBIDDEN).json({error: "Debes completar toda la informacion de tu perfil para convertirte en un usuario PREMIUM"})
        }

        next()
    }
}

export default authorized