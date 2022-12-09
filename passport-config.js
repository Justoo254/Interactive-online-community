const { authenticate } = require('passport')

const localStrategy = require('passport-local').Strategy
function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        if (username === null) {
            return done (null, false, {message})
        }
    }
    passport.use(new localStrategy({usernameField: 'username'},
    authenticateUser))
}