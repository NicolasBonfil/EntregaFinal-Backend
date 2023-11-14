import productsModel from "../../schemas/products.js";
import nodemailer from "nodemailer"

class ProductsDAO{
    getLeanProducts = async () => {
        const products = await productsModel.find().lean()
        return products
    }

    getProducts = async (limit, page, filtro, sort) => {
        const {totalPages, docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(filtro, {limit, page, lean: true})
        
        let products = docs
    
        if(sort && sort.toLowerCase() == "asc"){
            products = await productsModel.find().sort({price: 1})
        }else if(sort && sort.toLowerCase() == "desc"){
            products = await productsModel.find().sort({price: -1})
        }
    
        let prevLink
        hasPrevPage? prevLink = prevLink = `http://localhost:8080/products?page=${prevPage}` : null
        
        let nextLink
        hasNextPage? nextLink = nextLink = `http://localhost:8080/products?page=${nextPage}` : null
    
        return({products, totalPages, page, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink})
    }

    getProductById = async (id) => {
        const product = await productsModel.findOne({_id: id})
        
        if(!product) return error

        return product
    }

    addProduct = async (product) => {
        if(product.stock === 0) product.status = false
    
        let result = await productsModel.create(product)
        return result
    }

    updateProduct = async (pid, datosActualizados) => {
        const keys = Object.keys(datosActualizados)
        const values = Object.values(datosActualizados)

        const product = await productsModel.findOne({_id: pid})

        if(keys.includes("id")){
            const indice = keys.indexOf("id")
            keys.splice(indice, 1)
            values.splice(indice, 1)
        }

        for(let i = 0; i < keys.length; i++){
            let llave = keys[i]
            let valor = values[i]
            product[llave] = valor
        }
        
        await productsModel.updateOne({_id: pid}, product);
        return product
    }

    deleteProduct = async (pid, user) => {
        const product = await productsModel.findOne({_id: pid})
        if(!product) return error

        if(!(user.role === "ADMIN" || user.email === product.owner)) return error
        await productsModel.deleteOne({_id: pid})

        if(product.owner !== "ADMIN"){
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "bonfil.nico@gmail.com",
                    pass: "vohcftbednjfztsj"
                }
            })
    
            const mailParams = {
                from: "bonfil.nico@gmail.com",
                to: product.owner,
                subject: "Producto eliminado",
                html: `<div>
                    <p>Tu producto ${product.title} ${product.description} codigo: ${product.code} ha sido eliminado exitosamente.</p>
                </div>`,
            }
    
            transport.sendMail(mailParams, (error, info) => {
                if (error) {
                    customError.createError({
                        name: "Error al enviar el mail",
                        cause: "Internal Server Error",
                        message: "Ha ocurrido un error en el servidor",
                        code: EError.DATABASE_ERROR
                    })
                }
                
                const result = successResponse(info)
                return res.status(HTTP_STATUS.OK).send({status: "success", result});
            });
        }

        return "Producto eliminado"
    }
}

export default new ProductsDAO()