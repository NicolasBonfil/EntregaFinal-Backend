import { generateToken } from "./token.js";

export const updateCookie = (res, user) => {
    const access_token = generateToken(user)
    res.cookie("CoderCookie", access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    })
}