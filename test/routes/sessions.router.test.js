import { expect } from "chai"
import { dropUsers } from "../setup.test.js"
import supertest from "supertest"

const requester = supertest("http://localhost:3000")

describe("Session router test case", () => {
    before(async function() {
        await dropUsers()
    })

    let cookie;

    it("[POST] api/session/register sign up a user successfully", async() => {
        const mockUser = {
            first_name: "Nicolas",
            last_name: "Bonfil",
            email: "bonfil.nico@gmail.com",
            password: "1234"
        }

        const response = await requester.post("/api/session/register").send(mockUser)

        expect(response.statusCode).to.be.eql(200)
    })

    it("[POST] api/session/login sign in a user successfully", async() => {
        const credentials = {
            email: "bonfil.nico@gmail.com",
            password: "1234"
        }

        const response = await requester.post("/api/session/login").send(credentials)

        const cookieHeader = response.header["set-cookie"][0]

        cookie = {
            name: cookieHeader.split("=")[0],
            value: cookieHeader.split("=")[1]
        }

        console.log(cookieHeader);

        expect(cookieHeader).to.be.ok
        expect(cookie.value).to.be.ok
        //expect(response.statusCode).to.be.eql(200)
    })

    it("[GET] api/users/profile ", async() => {
        const response = await requester.get("/api/users/profile").send("Cookie", [`${cookie.name} = ${cookie.value}`])

        expect(response.body.payload.email).to.be.eql("bonfil.nico@gmail.com")
    })
})