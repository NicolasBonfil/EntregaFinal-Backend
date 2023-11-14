import { Router } from "express"

const router = Router()
router.get("/loggerTest", (req, res) => {
    console.log("loggers");
    
    req.logger.debug("debug")
    req.logger.http("http")
    req.logger.info("info")
    req.logger.warning("warn")
    req.logger.error("error")
    req.logger.fatal("fatal")

    res.send("Loggers")
})


router.get("/", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/resetPasswordEmail", (req, res) => {
    res.render("resetPasswordEmail")
})

router.get("/resetPassword", (req, res) => {
    res.render("resetPassword")
})

export default router
