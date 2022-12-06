const mysql = require('mysql2/promise')
require('dotenv').config()
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env
const db = mysql.createPool({
    host: MYSQL_HOST,
    port: '3306',
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

//회원가입 DB
const signup = async (data) => {
    const { email, username, password, mobile, gender } = data
    try {
        const result = await db.query('INSERT INTO user(email,username,password,mobile,gender) VALUES (?,?,?,?,?);', [email, username, password, mobile, gender])
        return result[0].insertId
    } catch (err) {
        return err
    }
}

//로그인 DB
const login = async (data) => {
    const { email, password } = data
    try {
        const result = await db.query('SELECT * FROM user WHERE email = ? AND password = ?;', [email, password])
        return result[0]
    } catch (err) {
        return err
    }
}

//이메일체크
const emailCheck = async (data) => {
    try {
        const findEmail = await db.query(`SELECT * FROM user WHERE email =?;`, [data])
        return findEmail[0]
    } catch (err) {
        return err
    }
}

//유저네임체크
const userNameCheck = async (data) => {
    try {
        const findUsername = await db.query(`SELECT * FROM user WHERE username =?;`, [data])
        console.log(findUsername)
        return findUsername[0]
    } catch (err) {
        return err
    }
}

//모든유저 DB
const allUser = async () => {
    try {
        const allUser = await db.query(`SELECT id,email,username,mobile,gender FROM user;`)
        return allUser[0]
    } catch (err) {
        return err
    }
}

//특정유저 DB
const findUser = async (data) => {
    try {
        const findUser = await db.query(`SELECT id,email,username,mobile,gender FROM user WHERE id=?;`, [data])
        return findUser[0]
    } catch (err) {
        return err
    }
}
module.exports = { signup, login, emailCheck, userNameCheck, allUser, findUser }