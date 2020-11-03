import app from "../src/index";
import supertest from "supertest";
import UserLogin from "../src/models/userLogin";
const jwt = require('jsonwebtoken');

describe("Testing authentication API: local strategy", () => {
  let _id: string;
  let token: string;
  const contentType: string = "application/json; charset=utf-8";

  it("Register", (done) => {
    supertest(app)
      .post("/api/auth/register")
      .send({
        username: "testobject9",
        password: "hi",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        token = res.body;

        jwt.verify(
          token,
          process.env.TOKEN_SECRET as string,
          (err: any, user: any) => {
            if(err){
              console.log(err);
            }
            _id = user.id;
          }
        );

        done();
      });
  });

  it("Login successful", (done) => {
    supertest(app)
      .post("/api/auth/login")
      .send({
        username: "testobject9",
        password: "hi",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body).not.toBeUndefined();
        done();
      });
  });

  it("Login unsuccessful", (done) => {
    supertest(app)
      .post("/api/auth/login")
      .send({
        username: "marcoasdfsadf",
        password: "hi",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(401)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.error).toEqual("Password or username is incorrect");
        done();
      });
  });

  it("Deleting test object", (done) => {
    let error = false;
    UserLogin.deleteOne({ _id: _id }, (err) => {
      if (err) {
        error = true;
      }
    });
    expect(error).toBe(false);

    done();
  });
});
