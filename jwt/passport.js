import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { jwtKey } from "../auth.js";
import { Users } from "../db/Users.js";
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtKey,
}
export function passInit(passport) {
    passport.use(
        new Strategy(options, async (payload, done) => {
            try {
                const user = await Users.findOne(
                    {
                        where: { id: payload.id },
                        attributes: {
                            exclude: ['password', 'updatedAt', 'createdAt']
                        }
                    }
                );
                if (user) {
                    done(null, user);
                } else {
                    done(null, false)
                }
            } catch (error) {
                console.log(error);
            }
        })
    )
};