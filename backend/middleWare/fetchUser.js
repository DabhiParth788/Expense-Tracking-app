var jwt = require("jsonwebtoken");
const JWT_SECRET = "maruDobuuu<3=RadhaRani<3";

const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token){
        res.status(401).send({ error: "Please Authenticate using a valid token" });
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please Authenticate using a valid token" });
    }
};

module.exports = fetchUser;