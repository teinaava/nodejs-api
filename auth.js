import { Users } from "./db/Users.js";
import jwt from "jsonwebtoken";
export const jwtKey = 'keykey';


export async function auth(req, res) {
    try {
        const user = await Users.findOne({ where: { login: req.body.login } });
        if (user) {
            if (user.password == req.body.password) {
                const token = jwt.sign({
                    login: user.login,
                    id: user.id
                }, jwtKey, { expiresIn: 60 * 60 });
                res.json({ message: 'success', token: `Bearer ${token}` });
            }
            else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
}
