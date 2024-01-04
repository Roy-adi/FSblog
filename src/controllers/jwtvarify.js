// import jwt from 'jsonwebtoken';


// export const authenticateToken = (request, response, next) => {
//     const authHeader = request.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
    
//     if (token == null) {
//         return response.status(401).json({ msg: 'token is missing' });
//     }

//     jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
//         if (error) {
//             return response.status(403).json({ msg: 'invalid token' })
//         }

//         request.user = user;
//         next();
//     })
// }




import jwt from 'jsonwebtoken';

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ error: 'Token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return response.status(401).json({ error: 'Token has expired' });
            }
            return response.status(403).json({ error: 'Invalid token' });
        }

        request.user = user;
        next();
    });
};
