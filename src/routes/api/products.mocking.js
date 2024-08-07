import { Router } from "express";
import CustomError from "../../services/CustomError.js"
import EErrors from "../../services/enum.js"
import { generateProductErrorInfo } from "../../services/info.js"

const users = []

const router = Router()

router.get("/", (req, res) => {
    res.send({ status: "success", payload: users})
})

router.post("/", (req, res) => {
    const { first_name, last_name, email } = req.body
    if(!first_name || !last_name || !email){
        CustomError.createError({
            name: "creacion de usuario",
            cause: generateProductErrorInfo({ first_name, last_name, email}),
            message: "Error al intentar crear un usuario",
            code: EErrors.INVALID_TYTPES_ERROR
        })
    }


    const user = {
        first_name,
        last_name,
        email
    }

    if(users.length === 0) {
        user.id = 1
    } else {
        user.id = users[users.length - 1].id + 1
    }

    users.push(user)
    res.send({ status: "success", payload: user })
})

export default router