import expressJwt from 'express-jwt';


// if given valid request the following will return user ID else err
export const requireSignin = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],

}); 

// check for the role of instructor to create lessons
export const isInstructor = async (req,res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if(!user.role.includes("Instructor")){
            return res.sendStatus(403)
        }else{
            next();
        }
        
    } catch (err) {
        console.log(err);
    }
}