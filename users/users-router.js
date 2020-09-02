const express = require("express")
const Users = require("./users-model")
const bcrypt = require("bcryptjs")
const authorize = require("../middleware/authorize")

const router = express.Router()

router.get("/users", authorize.restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 15),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		
		const passwordValid = await bcrypt.compare(password, user.password)
		
		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})	
		}

		//create a new session
		req.session.user = user

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get('/logout', authorize.restrict(), async (req, res, next) => {
	try {
		req.session.destroy(err => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router
