

import jwt from "jsonwebtoken"
export const   createRefreshToken = (payload) =>{


  const Secret_REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ;

    return jwt.sign(payload, Secret_REFRESH_TOKEN_SECRET, {
        expiresIn: "3d", 
  });
}





