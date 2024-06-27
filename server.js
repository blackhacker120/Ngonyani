if(process.env.NODE_ENV !== "production"){ 
    require("dotenv").config()
}
const express = require("express") 
const app = express() 


app.use(express.urlencoded({extended:false}))  

const users = []

const session = require("express-session") 
const flash = require("express-flash") 
const bcrypt = require("bcrypt") 
const passport = require("passport") 
const methodOverride = require("method-override") 
const initializePassport = require("./passport-config") 

initializePassport( 
    passport, 
    email => users.find(user => email === user.email), 
    id => users.find(user => id === user.id)
) 

app.use(flash()) 
app.use(session({ 
    secret:process.env.SESSION_SECRET, 
    resave:false, 
    saveUninitialized:false
})) 

app.use(passport.initialize()) 
app.use(passport.session()) 
app.use(methodOverride("_method")) 

app.post("/login" , passport.authenticate("local" , { 
    successRedirect:"/", 
    failureRedirect:"/login", 
    failureFlash:true
})) 

app.post("/register" , async(req , res) => { 
    try {
       const hashedPassword = await bcrypt.hash(req.body.password , 10) 
       users.push({ 
           id:Date.now().toString(), 
           name:req.body.name, 
           email:req.body.email, 
           password:hashedPassword
       })  
       console.log(users) 
       res.redirect("/login")
    } catch (e) {
        console.log(e) 
        res.redirect("/register")
    }
})



app.get("/" , (req , res) => { 
    res.render("index.ejs")
})   

app.get("/about" , (req , res) => { 
    res.render("about.ejs")
})  

app.get("/champions" , (req , res) => { 
    res.render("champions.ejs")
})  

app.get("/ethiopia" , (req , res) => { 
    res.render("ethiopia.ejs")
})  

app.get("/tanzania" , (req , res) => { 
    res.render("tanzania.ejs")
})   

app.get("/formResponse" , (req , res) => { 
    res.render("formResponse.ejs")
})






app.listen(4000)