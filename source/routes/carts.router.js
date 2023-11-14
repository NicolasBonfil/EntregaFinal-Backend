import { Router } from "express"
import cartController from "../controllers/carts.controller.js"
import auth from "../middlewares/auth.middlewares.js"


class CartRouter{
    constructor(){
        this.InicioCart = Router()
        this.InicioCart.get("/", cartController.getCartProducts)
        this.InicioCart.post("/products", auth(["BASIC", "PREMIUM"]), cartController.addProductToCart)
        this.InicioCart.delete("/products", auth(["BASIC", "PREMIUM"]), cartController.removeProductFromCart)
        this.InicioCart.put("/", cartController.updateCartProducts)
        this.InicioCart.put("/products/:pid", cartController.updateProductQuantity)
        this.InicioCart.delete("/", auth(["BASIC", "PREMIUM"]),cartController.deleteCartProducts)

        this.InicioCart.post("/finalizarCompra", cartController.finalizarCompra)
    }

    getRouter(){
        return this.InicioCart
    }
}

export default new CartRouter()