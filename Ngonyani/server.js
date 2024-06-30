if(process.env.NODE_ENV !== "production"){ 
    require("dotenv").config()
}
const express = require("express") 
const app = express() 


const users = [] 

let user = { 
    ProfilePhoto : '/default.jpg'
}

const bcrypt = require("bcrypt") 
const flash  = require("express-flash") 
const session = require("express-session") 
const passport = require("passport") 
const methodOverride = require("method-override")  
const path = require("path") 
const multer = require("multer")

const initializePassport = require("./passport-config") 

initializePassport( 
    passport, 
    email => users.find(user => email === user.email), 
    id => users.find(user => id === user.id)
) 

const Storage = multer.diskStorage({ 
    destination : function(req , file , cb){ 
        cb(null ,  'Public/Uploads')
    }, 

    filename : function(req , file , cb){ 
        cb(null , Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({storage : Storage})


app.use(express.urlencoded({extended:false})) 


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
    successRedirect : "/", 
    failureRedirect : "/login", 
    failureFlash:true
})) 

app.post("/upload" , upload.single("ProfilePhoto") , (req , res) => { 
    if(req.file){ 
        user.ProfilePhoto = '/Uploads/' + req.file.filename
    } 
    res.redirect('/')
})


app.post("/register" , async(req , res) => { 
    try {
        const hashedPassword = await bcrypt.hash(req.body.password , 10) 
        users.push({ 
            id:Date.now().toString(), 
            name:req.body.name, 
            email:req.body.email, 
            password:hashedPassword, 
            ProfilePhoto:req.body.ProfilePhoto
        }) 
        console.log(users) 
        res.redirect('/login')
    } catch (e) {
        console.log(e) 
        res.redirect('/register')
    }
}) 

app.get("/" , (req , res) => { 
    res.render("index.ejs" , {user:user})
}) 

app.get("/login" , (req , res) => { 
    res.render("login.ejs")
}) 

app.get("/register" , (req , res) => { 
    res.render("register.ejs")
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


app.listen(4000)