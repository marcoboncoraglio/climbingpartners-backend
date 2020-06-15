import app from "../src/index";
import supertest from "supertest";
import UserLogin from "../src/models/userLogin";

describe("Testing authentication API: local strategy", () => {
  let id: string;
  const contentType: string = "application/json; charset=utf-8";

  it("Register", (done) => {
    supertest(app)
      .post("/api/auth/register")
      .send({
        username: "testobject1234",
        password: "hi",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        id = res.body.id;

        done();
      });
  });

  it("Login successful", (done) => {
    supertest(app)
      .post("/api/auth/login")
      .send({
        username: "testobject1234",
        password: "hi",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.id).toEqual(id);
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

  it("Logout", (done) => {
    supertest(app)
      .post("/api/auth/logout")
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.text).toEqual("Logged out");
        done();
      });
  });

  it("Deleting test object", (done) => {
    let error = false;
    UserLogin.deleteOne({ _id: id }, (err) => {
      if (err) {
        error = true;
      }
    });
    expect(error).toBe(false);

    done();
  });
});
