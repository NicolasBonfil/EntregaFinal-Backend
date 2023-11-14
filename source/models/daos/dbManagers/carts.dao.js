import cartsModel from "../../schemas/carts.js"
import productsModel from "../../schemas/products.js"

class CartDAO{
    createCart = async () => {
        const products = []
        const cart = {
            products
        }
        
        let result = await cartsModel.create(cart)
        return result  
    }

    getCartProducts = async (cid) => {
        const carrito = await cartsModel.findOne({_id: cid}).populate("productsInCart.product").lean(true)
        return (carrito.productsInCart) 
    }

    addProductToCart = async (cid, pid, email) => {
        const cart = await cartsModel.findOne({_id: cid})

        const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);

        const productM = await productsModel.findOne({_id: pid})

        if(productM.owner === email) return error

        const product = {_id: pid}

        if(productIndex == -1){
            let quantity = 1
            cart.productsInCart.push({quantity, product})
        }else{
            cart.productsInCart[productIndex].quantity = parseInt(cart.productsInCart[productIndex].quantity)+1;
        }

        await cartsModel.updateOne({_id: cart.id }, cart);
        return cart
    }

    removeProductFromCart = async (cid, pid) => {
        const cart = await cartsModel.findOne({_id: cid})

        const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
        if(productIndex === -1) return error

        cart.productsInCart.splice(productIndex, 1)

        await cartsModel.updateOne({_id: cart._id }, cart);
    
        return cart
    }

    updateCartProducts = async (cid, products) => {
        const productsToAdd = []
        
        const cart = await cartsModel.findOne({_id: cid})

        products.forEach(p => {
            let quantity = p.quantity
            let product = p.product
            const producto = productsToAdd.find(prod => prod.product == p.product)
            if(producto){
                producto.quantity += quantity
            }else{
                productsToAdd.push({quantity, product})
            }
        })

        cart.productsInCart = productsToAdd

        await cartsModel.updateOne({_id: cart.id }, cart);
        return {cart, productsToAdd}
    }

    updateProductQuantity = async (cid, pid, selectedQuantity) => {
        if (typeof selectedQuantity !== "number" || selectedQuantity <= 0 || !(Number.isInteger(selectedQuantity))) return error

        const cart = await cartsModel.findOne({_id: cid})

        const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
        if(productIndex === -1) return error

        cart.productsInCart[productIndex].quantity = selectedQuantity

        await cartsModel.updateOne({_id: cart.id }, cart);
        return cart
    }

    deleteCartProducts = async (cid) => {
        const cart = await cartsModel.findOne({_id: cid})
        cart.productsInCart = []

        await cartsModel.updateOne({_id: cart.id }, cart);
        return cart
    }
}

export default new CartDAO()

