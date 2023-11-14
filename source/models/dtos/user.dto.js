export class SaveUserDTO{
    constructor(payload){
        this.first_name = payload.user.first_name
        this.last_name = payload.user.last_name
        this.email = payload.user.email
        this.role = payload.user.role
        this.cart = payload.user.cart
        this.documents = payload.user.documents
        this.last_connection = payload.user.last_connection
    }

    async getUser(){
        const userDto = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            role: this.role,
            cart: this.cart,
            documents: this.documents,
            last_connection: this.last_connection
        }

        return userDto
    }
}
