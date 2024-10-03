import request from "supertest";
import express, { Application } from "express";
import { parsePatientData } from "../../src/controllers/patientController";

const app: Application = express();

app.use(express.json());
app.post("/patient", parsePatientData);

describe("Integration Test: parsePatientData Controller", () => {
  it("should return 200 with valid patient data for a well-formed message", async () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    const response = await request(app).post("/patient").send({ message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A",
      },
      dateOfBirth: "1980-01-01",
      primaryCondition: "Common Cold",
    });
  });

  it("should return 400 if message is not provided", async () => {
    const response = await request(app).post("/patient").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid message format or empty body",
    });
  });

  it("should return 500 if PRS segment is malformed", async () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    const response = await request(app).post("/patient").send({ message });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error:
        "PRS segment is malformed: Missing required name fields. Received: ",
    });
  });

  it("should return 500 if the date of birth is invalid", async () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|invalid_date|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    const response = await request(app).post("/patient").send({ message });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "PRS segment contains an invalid date of birth: invalid_date",
    });
  });

  it("should return 500 if admitting diagnosis is missing", async () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|`;

    const response = await request(app).post("/patient").send({ message });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "DET segment is malformed: Missing admitting diagnosis.",
    });
  });
});
