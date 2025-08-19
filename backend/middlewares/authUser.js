import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers
            
        if (!token) {
            return res.json({success: false, message: 'Not authorized. Login again'})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        console.log('aaaaaaaaaaaaaaaaaaaaaaaa')
        res.json({success: false, message: error.message})
    }
}

export default authUser