const LocalStrategy = require("passport-local").Strategy 
const bcrypt = require("bcrypt") 

function initialize(passport , getUserByEmail , getUserById){ 
    const AuthenticatedUsers = async(email, password , done) => { 
        const user = getUserByEmail(email) 
        if(user == null){ 
            return done(null , false , {message : 'Email doesnt exists'})
        } 

        try {
            if(await bcrypt.compare(user , password.user)){ 
                return done(null , user)
            } 
            else{ 
                return done(null , false , {message : 'Incorrect Password'})
            }
        } catch (e) {
            console.log(e) 
            return done(e)
        }
    } 
    passport.use(new LocalStrategy({usernameField:'email'} , AuthenticatedUsers)) 
    passport.serializeUser((user , done) => done(null , user.id)) 
    passport.deserializeUser((id , done) => { 
        return done(null , getUserById(id))
    })
} 

module.exports = initialize