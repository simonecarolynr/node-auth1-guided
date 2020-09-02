const Users = require("../users/users-model")

function restrict() {
    return async (req, res, next) => {
        try {
        //     const { username, password } = req.headers
            
        //     const authError = {
        //         message: "Insufficient credentials provided"
        //     }
        //     if (!username || !password) {
        //         res.status(401).json({
                   
        //         })
        //     }

        //     const user = await Users.findBy({ username }).first()
        //     if(!user) {
        //         return res.status(401).json(authError)
        //     }

        //     const passwordValid = await bcrypt.compare(password, user.password)
        //     if (!passwordValid) {
        //         return res.status(403).json(authError)
        //     }

        if (!req.session || !req.session.user) {
            return res.status(401).json(authError)
        }

        } catch (err) {
            next(err)
        }
    }
}

module.exxports = {
    restrict
}