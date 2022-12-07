"use strict"

const loginform = document.querySelector("#login-form")
const signform = document.querySelector("#signup-form")
const welcome = document.querySelector(".welcome")
const logon = document.querySelectorAll(".logon")
const getout = document.querySelectorAll(".logout")
const emailTag = document.querySelector(".email")
const usernameTag = document.querySelector(".username")
const mobileTag = document.querySelector(".mobile")
const genderTag = document.querySelector(".gender")
const accessToken = window.localStorage.getItem("token")

//전화번호 패턴
const phone = (target) => {
    target.value = target.value
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
        .replace(/(\-{1,2})$/g, "")
}

//로그아웃
const logout = () => {
    window.localStorage.clear()
    alert("로그아웃 되었습니다.")
    window.location.reload()
}

//로그인폼
if (loginform) {
    loginform.addEventListener("submit", async function (e) {
        e.preventDefault()
        let data = {}
        const payload = new FormData(loginform)
        payload.forEach((value, key) => (data[key] = value))
        try {
            const loginfetch = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const res = await loginfetch.json()
            if (res.message === "ID dose not exist") {
                alert("이메일 또는 비밀번호를 확인해주세요.")
            } else {
                window.localStorage.setItem("token", res.data)
                window.localStorage.setItem("myauth", data.email)
                window.location.replace("index.html")
            }
        } catch (err) {
            console.log(err)
        }
    })
}

//회원가입폼
if (signform) {
    signform.addEventListener("submit", async function (e) {
        e.preventDefault()
        let data = {}
        const payload = new FormData(signform)
        payload.forEach((value, key) => (data[key] = value))
        try {
            const signfetch = await fetch("http://localhost:8000/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const res = await signfetch.json()
            if (res.message === "exists email") {
                alert("존재하는 이메일입니다")
            } else if (res.message === "exists username") {
                alert("존재하는 닉네임입니다")
            } else if (res.message === "not match password") {
                alert("입력한 비밀번호가 서로 다릅니다")
            } else if (res.message === "fill in the fields") {
                alert("입력칸을 모두 채워주세요")
            } else {
                alert("회원가입 성공")
                window.location.replace("index.html")
            }
        } catch (err) {
            console.log(err)
        }
    })
}

//페이지마다 인증처리
const data = async () => {
    try {
        const fetching = await fetch("http://localhost:8000/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        })
        const res = await fetching.json()
        if (res.data) {
            if (welcome) {
                welcome.innerText = `환영합니다 [${res.data.username}]님! 좋은하루 되세요`
            }
            if (emailTag) {
                const findUser = await fetch(`http://localhost:8000/users/${res.data.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const user = await findUser.json()
                emailTag.innerText = `이메일 : ${user.data.email}`
                usernameTag.innerText = `별명 : ${user.data.username}`
                mobileTag.innerText = `전화번호 : ${user.data.mobile}`
                genderTag.innerText = `성별 : ${user.data.gender === 0 ? `남자` : `여자`}`
            }
            logon.forEach((el) => (el.style.display = "none"))
            getout.forEach((el) => (el.style.display = "block"))
        } else {
            if (welcome) {
                welcome.innerText = `환영합니다 [Guest]님! 좋은하루 되세요`
            }
            if (emailTag && res.message === "Bad Request") {
                window.location.replace("index.html")
            }
            logon.forEach((el) => (el.style.display = "block"))
            getout.forEach((el) => (el.style.display = "none"))
        }
    } catch (err) {
        console.log(err)
    }
}

data()
