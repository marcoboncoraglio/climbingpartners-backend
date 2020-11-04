const jwt = require('jsonwebtoken');

//todo: better error handling
export function getIdFromToken(token: any): string {
  jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      console.log(err);
      //throw some sort of error
    }

    return user.id;
  });

  return 'false';
}
