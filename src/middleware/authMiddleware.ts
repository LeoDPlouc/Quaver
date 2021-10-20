import { Request, Response, NextFunction } from "express"

function protect(req: Request, res: Response, next: NextFunction) {
    const { user } = req.session
    /*
        if (!user) {
            return res.status(401).json({ status: "fail", message: "unauthorized" })
        }
    
        req.user = user
    */
    next()
}

export { protect }