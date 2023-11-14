import { expect } from "chai"
import supertest from "supertest"
import { dropCarts } from "../setup.test.js"

const requester = supertest("http://localhost:8080")

let cartId;

describe("Products router test case", async () => {
    before(async () => {
        this.timeout(50000)
        await dropCarts()
    })

    it("[GET] api/carts -get user's cart", async () => {
        const response = await requester.get("/api/carts")

        expect(response.statusCode).to.be.eql(200)
    })

    it("[POST] api/carts -create a cart", async () => {
        const response = await requester.post("/api/carts")

        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload._id).to.be.ok

        cartId = response.body.payload._id
    })

    it("[POST] api/carts -add a product to the cart", async () => {
        const response = await requester.post(`/api/carts/${cartId}/products/650474c43019484914987ef9`)

        expect(response.statusCode).to.be.eql(200)
    })

    it("[PUT] api/carts -update a product quantity", async () => {
        const quantity = 5
        const response = await requester.put(`/api/carts/${cartId}/products/650474c43019484914987ef9`).send(quantity)

        expect(response.statusCode).to.be.eql(200)
    })

    it("[DELETE] api/carts -delete a product from the cart", async () => {
        const response = await requester.delete(`/api/carts/${cartId}/products/650474c43019484914987ef9`)

        expect(response.statusCode).to.be.eql(200)
    })


    it("[PUT] api/carts -update cart products", async () => {
        const mockProducts = [
            {
                title: "Medias",
                description: "Nike Blancas",
                price: 150,
                code: "1029042933472472947294932091",
                stock: 2,
                category: "Medias",
                status: true,
                thumbnail: "fifhsf"
            },
            {
                title: "Remera",
                description: "Adidas Negra",
                price: 275,
                code: "5945154112212015456945674564",
                stock: 20,
                category: "Remeras",
                status: true,
                thumbnail: "fifhsf"
            }
        ]

        const response = await requester.put(`/api/carts/${cartId}`).send(mockProducts)
        expect(response.statusCode).to.be.eql(200)
    })

    it("[DELETE] api/carts -delete cart products", async () => {
        const response = (await requester.delete(`/api/carts/${cartId}`))
        expect(response.statusCode).to.be.eql(200)
    })
})