const Model = require('../models/user');
const { sign, verify } = require('jsonwebtoken');

//회원가입
const signup = async (req, res) => {
    const { email, username, password, passwordConfirm } = req.body;
    try {
        if (email && username && password) {
            const emailCheck = await Model.emailCheck(email)
            const userNameCheck = await Model.emailCheck(username)
            if (emailCheck.length > 0) {
                return res.status(400).json({ message: "exists email" })
            } else if (userNameCheck.length > 0) {
                return res.status(400).json({ message: "exists username" })
            } else if (password !== passwordConfirm) {
                return res.status(400).json({ message: "not match password" })
            } else {
                const result = await Model.signup(req.body)
                return res.status(201).json({ message: "회원가입이 완료되었습니다!", data: result })
            }
        } else {
            return res.status(400).json({ message: "fill in the fields" })
        }
    } catch (err) {
        return res.status(400).json({ message: 'Bad Request' })
    }
}

//로그인
const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (email && password) {
            const result = await Model.login(req.body)
            if (result.length > 0) {
                const { id, email, username, mobile, gender } = result[0]
                const payload = {
                    id,
                    email,
                    username,
                    mobile,
                    gender
                }
                const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' })
                return res.status(200).json({ message: "login User", data: token })
            } else {
                return res.status(400).json({ message: "ID dose not exist" })
            }
        }
    } catch (err) {
        return res.status(400).json({ message: 'Bad Request' })

    }
}

//모든유저 불러오기
const allUser = async (req, res) => {
    try {
        const result = await Model.allUser(req.body)
        return res.status(200).json({ message: "called allUser", data: result })
    } catch (err) {
        return res.status(400).json({ message: 'Bad Request' })
    }
}

//특정유저 불러오기
const findUser = async (req, res) => {
    try {
        const result = await Model.findUser(req.params.id)
        if (result.length > 0) {
            return res.status(200).json({ message: "called findUser", data: result[0] })
        } else {
            return res.status(200).json({ message: "not exist user" })
        }
    } catch (err) {
        return res.status(400).json({ message: 'Bad Request' })
    }
}

//유저인증
const authorized = async (req, res) => {
    try {
        const token = req.headers.authorization.replace('Bearer', '').trim()
        verify(token, process.env.JWT_SECRET, function (err, decoded) {
            const { id, email, username, mobile, gender } = decoded
            if (decoded) {
                return res.status(200).json({ message: 'verify user', data: { id, email, username, mobile, gender } })
            } else {
                return res.status(401).json({ message: 'do not verify' })
            }
        })
    } catch (err) {
        return res.status(401).json({ message: 'Bad Request' })
    }
}

module.exports = { signup, login, allUser, authorized, findUser }