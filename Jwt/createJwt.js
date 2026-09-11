

import jwt from "jsonwebtoken"
export const   generateJWT = (payload) =>{


  const secret_ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET ;

    return jwt.sign(payload, secret_ACCESS_TOKEN, {
        expiresIn: "2h",
  });
}
