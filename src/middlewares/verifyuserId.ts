import jwt from "jsonwebtoken";

function verifyUserId(req: any, res: any, next: any) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: "No Authorization Header" });
    }

    try {
        const token = authorization.split(" ")[1];
        const secret = process.env.JWT_SECRET ?? '';
        const decoded: any = jwt.verify(token, secret);

        req.user = { id: decoded.userId }; 

        next();
    } catch (error: any) {
        return res.status(401).json({
            message: "Invalid Token",
            error: error.message,
        });
    }
}

export default verifyUserId;