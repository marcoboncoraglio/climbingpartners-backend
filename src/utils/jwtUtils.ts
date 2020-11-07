const jwt = require('jsonwebtoken');

//todo: better error handling
export function getIdFromToken(token: any): string {
  jwt.verify(token, process.env.TOKEN_SECRET, (err: any, obj: any) => {
    if (err) {
      console.log(err);
      //throw some sort of error
    }

    return obj._id;
  });

  return 'false';
}
