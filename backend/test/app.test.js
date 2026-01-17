import request from "supertest";
//import { describe, it } from "vitest";

import app from "../src/app.js";

describe("app", () => {
  it("responds with a not found message", () =>
    request(app)
      .get("/what-is-this-even")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404));
});

describe("GET /", () => {
  it("responds with a json message", () =>
    request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!res.body.message.includes("🦄🌈✨👋🌎🌍🌏✨🌈🦄")) {
          throw new Error("Message does not contain expected emojis");
        }
      }));
});