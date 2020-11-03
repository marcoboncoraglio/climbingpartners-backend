import app from "../src/index";
import supertest from "supertest";
const jwt = require('jsonwebtoken');

describe("Testing userCards API", () => {
  let _id: string;
  const contentType: string = "application/json; charset=utf-8";
  let token: any;

  beforeAll((done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({
        username: 'marco1',
        password: 'hi',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        token = res.body;
        jwt.verify(
          token,
          process.env.TOKEN_SECRET as string,
          (err: any, user: any) => {
            console.log(err);
            if (err) return res.sendStatus(403);
            _id = user.id;
          }
        );
        done();
      });
  });

  it("Post userCard", (done) => {
    supertest(app)
      .post("/api/userCards")
      .send({
        id: _id,
        name: "marco2",
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        _id = res.body.id;
        done();
      });
  });

  it("Get userCard by id", (done) => {
    supertest(app)
      .get(`/api/userCards/${_id}`)
      .expect("Content-Type", contentType)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.id).toEqual(_id);
        done();
      });
  });

  it("Put userCard", (done) => {
    const newUserCard = {
      name: "marco1",
      imgUrl:
        "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    };

    supertest(app)
      .put(`/api/userCards/${_id}`)
      .send({
        name: newUserCard.name,
        imgUrl: newUserCard.imgUrl,
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.name).toEqual(newUserCard.name);

        expect(res.body.imgUrl).toEqual(newUserCard.imgUrl);
        done();
      });
  });

  it("Patch userCard", (done) => {
    const newName = "jimmy";
    supertest(app)
      .patch(`/api/userCards/${_id}`)
      .send({
        name: newName,
      })
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.name).toEqual(newName);
        done();
      });
  });

  it("Delete userCard", (done) => {
    supertest(app)
      .delete(`/api/userCards/${_id}`)
      .set("Content-Type", contentType)
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.error).toBe("Deleted User Card");
        done();
      });
  });
});
