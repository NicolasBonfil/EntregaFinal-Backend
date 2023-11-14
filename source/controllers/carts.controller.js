import cartsRepository from "../models/repositories/carts.repository.js"
import { HTTP_STATUS, HttpError, successResponse } from "../utils/responses.js"
import usersModel from "../models/schemas/Users.model.js"
import productsRepository from "../models/repositories/products.repository.js"
import userModel from "../models/schemas/Users.model.js"
import ticketRepository from "../models/repositories/ticket.repository.js"
import { updateCookie } from "../utils/updateCookie.js"

class CartController{
    async getCartProducts(req, res, next){
        try {
            const products = await cartsRepository.getCartProducts(req.user.cart._id)
            const totalPrice = products.reduce((total, producto) => total += (producto.product.price * producto.quantity), 0)
            const response = successResponse(products)
            return res.status(HTTP_STATUS.OK).render("carts", {products, totalPrice})
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async createCart(req, res, next, id){
        try {
            const newCart = await cartsRepository.createCart()

            await usersModel.updateOne({_id: id}, {$set: {cart: newCart}})
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async addProductToCart(req, res, next){
        const cid = req.user.cart._id
        const {pid} = req.body

        try {
            const addedProduct = await cartsRepository.addProductToCart(cid, pid, req.user.email)
            
            await usersModel.updateOne({email: req.user.email}, {$set: {cart: addedProduct}})

            req.user.cart = addedProduct


            updateCookie(res, req.user)
  
            const response = successResponse(addedProduct)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async removeProductFromCart (req, res, next){
        const cid = req.user.cart._id
        const {pid} = req.body

        try {
            const removedProduct = await cartsRepository.removeProductFromCart(cid, pid)

            const productIndex = req.user.cart.productsInCart.findIndex(p => p.product === pid)

            req.user.cart.productsInCart.splice(productIndex, 1)

            updateCookie(res, req.user)

            await usersModel.updateOne({email: req.user.email}, {$set: {cart: removedProduct}})
  
            const response = successResponse(removedProduct)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async updateCartProducts(req, res, next){
        const cid = req.user.cart._id
        const products = req.body

        try {    
            const {cart, productsToAdd} = await cartsRepository.updateCartProducts(cid, products)

            req.user.cart.productsInCart = productsToAdd

            updateCookie(res, req.user)
  
            const response = successResponse(cart)
            res.status(HTTP_STATUS.OK).send(response)

        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async updateProductQuantity(req, res, next){
        const cid = req.user.cart._id
        const pid = req.params.pid
        const {quantity} = req.body

        try {
            const updatedQuantity = await cartsRepository.updateProductQuantity(cid, pid, quantity);

            req.user.cart.productsInCart = updatedQuantity.productsInCart

            updateCookie(res, req.user)
  
            const response = successResponse(updatedQuantity)
            res.status(HTTP_STATUS.OK).send(response);   
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async deleteCartProducts(req, res, next){
        const cid = req.user.cart._id

        try {
            const removedProducts = await cartsRepository.deleteCartProducts(cid)

            req.user.cart.productsInCart = []

            updateCookie(res, req.user)
  
          
            const response = successResponse(removedProducts)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async finalizarCompra(req, res, next){
        const purchased = []
        const notPurchased = []
        
        const products = req.user.cart.productsInCart
        
        async function filtrar(){
            for(let p of products){
                try {
                    const product = await productsRepository.getProductById(p.product)
                    if(product.stock < p.quantity){
                        notPurchased.push({product: p.product, quantity: p.quantity})
                    }else{
                        purchased.push({product: product, quantity: p.quantity})
                        await cartsRepository.removeProductFromCart(req.user.cart._id, p.product)
                    }
                } catch (error) {
                    return new HttpError("Error al actualizar el carrito", HTTP_STATUS.BAD_REQUEST)
                }

            }
        }

        await filtrar()
        
        
        const amount = purchased.reduce( (acc, p) => {
            return (acc + p.product.price * p.quantity)
        }, 0)
        
        try{
            
            if(amount > 0){
                const user = await userModel.findOne({email: req.user.email})
                user.cart.productsInCart = notPurchased
                await userModel.updateOne({email: req.user.email}, user)

                req.user.cart.productsInCart = notPurchased

                updateCookie(res, req.user)

                const ticket = await ticketRepository.createTicket(req.user.email, amount)
                const response = successResponse(ticket)

                return res.status(HTTP_STATUS.CREATED).send(response)
            }
        }catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }
}

export default new CartController()