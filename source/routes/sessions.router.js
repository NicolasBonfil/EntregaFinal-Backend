import { Router } from "express"
import passport from "passport"
import sessionsController from "../controllers/sessions.controller.js"

const router = Router()

router.post("/register", passport.authenticate("register", {passReqToCallback: true, session: false, failureMessage: true}), sessionsController.register)
router.post("/login", passport.authenticate("login", {passReqToCallback: true, session: false}), sessionsController.login)
router.post("/logout", sessionsController.logout)

router.post("/resetPasswordEmail", sessionsController.resetPasswordEmail)
router.post("/resetPassword", sessionsController.resetPassword)




export default router