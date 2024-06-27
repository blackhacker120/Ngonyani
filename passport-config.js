const localStrategy = require("passport-local").Strategy 
const bcrypt = require("bcrypt") 

function initialize(passport , getUserByEmail , getUserById){ 
    const AuthenticatedUsers = async(email , password , done) => { 
        const user = getUserByEmail(email) 
        if(user == null){ 
            return done(null , false , {message : 'email doesnt exists'})
        } 

        try {
            if(await bcrypt.compare(password , user.password)){ 
                return done(null , user)
            } 
            else{ 
                return done(null , false , {message : 'Incorrect password'})
            }
        } catch (e) {
            console.log(e) 
            return done(e)
        }
    } 

    passport.use(new localStrategy({usernameField : 'email'} , AuthenticatedUsers)) 
    passport.serializeUser((user , done) => done(null , user.id)) 
    passport.deserializeUser((id , done) => { 
        return done(null , getUserById(id))
    })
} 

module.exports = initialize