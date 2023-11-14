import customError from "../../errors/customError.js"
import { dataBaseError, invalidData, missingDataError, nonExistentCart, nonexistentProduct } from "../../errors/info.js"
import EError from "../../errors/num.js"
import cartsDAO from "../daos/dbManagers/carts.dao.js"
import cartsModel from "../schemas/carts.js"
import productsModel from "../schemas/products.js"

class CartsRepository{
    async getCartProducts(cid){
        try {
            return await cartsDAO.getCartProducts(cid) 
        } catch (error){
            if(!cid){
                customError.createError({
                    name: "Error al obtener los productos del carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
        
            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                customError.createError({
                    name: "Error al obtener los productos del carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al obtener los productos del carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async createCart(){
        try {
            return await cartsDAO.createCart()
        } catch (error) {
            customError.createError({
                name: "Error al crear el carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async addProductToCart(cid, pid, email){
        try{
            return await cartsDAO.addProductToCart(cid, pid, email)
        } catch (error) {
            if(!cid){
                customError.createError({
                    name: "Error al agregar el producto al carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!pid){
                customError.createError({
                    name: "Error al agregar el producto al carrito",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const product = await productsModel.findOne({_id: pid})

            if(product.owner === email){
                customError.createError({
                    name: "Error al agregar el producto al carrito",
                    cause: "El usuario esta intentando agregar un producto propio al carrito",
                    message: "No puedes agregar un producto propio a tu carrito",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
        
            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                customError.createError({
                    name: "Error al agregar el producto al carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al agregar el producto al carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async removeProductFromCart(cid, pid){
        try{
            return await cartsDAO.removeProductFromCart(cid, pid)
        } catch (error) {
            if(!cid){
                customError.createError({
                    name: "Error al eliminar el producto del carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!pid){
                customError.createError({
                    name: "Error al eliminar el producto del carrito",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!cart){
                customError.createError({
                    name: "Error al eliminar el producto del carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
            if(productIndex === -1){
                customError.createError({
                    name: "Error al eliminar el producto del carrito",
                    cause: nonexistentProduct(pid),
                    message: "Producto inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al eliminar el producto del carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async updateCartProducts(cid, products){
        try{
            return await cartsDAO.updateCartProducts(cid, products)
        } catch (error) {
            if(!cid){
                customError.createError({
                    name: "Error al actualizar los productos del carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!products){
                customError.createError({
                    name: "Error al actualizar los productos del carrito",
                    cause: missingDataError("Productos"),
                    message: "La informacion de los productos esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
        
            products.forEach(p => {
                if(!p.product){
                    customError.createError({
                        name: "Error al actualizar los productos del carrito",
                        cause: missingDataError("Id del producto"),
                        message: "La informacion del id del producto esta incompleta",
                        code: EError.INVALID_TYPES_ERROR
                    })
                }

                if(!p.quantity){
                    customError.createError({
                        name: "Error al actualizar los productos del carrito",
                        cause: missingDataError("Cantidad del producto"),
                        message: "La informacion de la cantidad del producto esta incompleta",
                        code: EError.INVALID_TYPES_ERROR
                    })
                }
            })

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                customError.createError({
                    name: "Error al actualizar los productos del carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al actualizar los productos del carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async updateProductQuantity(cid, pid, quantity){
        try{
            return await cartsDAO.updateProductQuantity(cid, pid, quantity)
        } catch (error) {
            if(!cid){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!pid){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!quantity){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: missingDataError("Cantidad del producto"),
                    message: "La informacion de la cantidad del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
            if(productIndex === -1){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: nonexistentProduct(pid),
                    message: "Producto inexistente",
                    code: EError.NOT_FOUND
                })
            }
            

            if (!(Number.isInteger(quantity)) || typeof quantity !== "number" || quantity <= 0){
                customError.createError({
                    name: "Error al actualizar la cantidad del producto en el carrito",
                    cause: invalidData(quantity),
                    message: "El tipo de dato es invalido",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            customError.createError({
                name: "Error al actualizar la cantidad del producto en el carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async deleteCartProducts(cid){
        try{
            return await cartsDAO.deleteCartProducts(cid)
        } catch (error) {
            if(!cid){
                customError.createError({
                    name: "Error al eliminar los productos del carrito",
                    cause: missingDataError("Id del carrito"),
                    message: "La informacion del id del carrito esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                customError.createError({
                    name: "Error al obtener el carrito",
                    cause: nonExistentCart(cid),
                    message: "Carrito inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al eliminar los productos del carrito",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }
}

export default new CartsRepository()