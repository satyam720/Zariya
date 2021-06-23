import expressJwt from 'express-jwt';


// if given valid request the following will return user ID else err
export const requireSignin = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],

}); 