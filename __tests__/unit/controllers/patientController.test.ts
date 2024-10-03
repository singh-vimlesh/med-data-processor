import { Request, Response } from "express";
import { parsePatientData } from "../../../src/controllers/patientController";
import { processPatientData } from "../../../src/services/patientService";
import { PatientData } from "../../../src/models/patient";

// Mock the processPatientData function
jest.mock("../../../src/services/patientService");

describe("parsePatientData", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonResponse: jest.Mock;

  beforeEach(() => {
    // Set up the mocked response object
    jsonResponse = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jsonResponse,
    };
  });

  it("should return extracted patient data and save it to the database", async () => {
    req = {
      body: {
        message: `
        MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
        EVT|TYPE|20230502112233
        PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
        DET|1|I|^^MainDepartment^101^Room 1|Common Cold
        `,
      },
    };

    const expectedOutput: PatientData = {
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A",
      },
      dateOfBirth: "1980-01-01",
      primaryCondition: "Common Cold",
    };

    (processPatientData as jest.Mock).mockReturnValue(expectedOutput);

    await parsePatientData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonResponse).toHaveBeenCalledWith(expectedOutput);
  });

  it("should return 400 if message is not provided", async () => {
    req = {
      body: {},
    };

    await parsePatientData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toHaveBeenCalledWith({
      error: "Invalid message format or empty body",
    });
  });

  it("should return 400 if message is an empty string", async () => {
    req = {
      body: {
        message: "",
      },
    };

    await parsePatientData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toHaveBeenCalledWith({
      error: "Invalid message format or empty body",
    });
  });

  it("should return 500 if an error occurs in data extraction", async () => {
    req = {
      body: {
        message: "invalid message",
      },
    };

    (processPatientData as jest.Mock).mockImplementation(() => {
      throw new Error("Extraction error");
    });

    await parsePatientData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonResponse).toHaveBeenCalledWith({ error: "Extraction error" });
  });

  it("should return 500 if required segments are missing from the message", async () => {
    req = {
      body: {
        message: `
        MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
        EVT|TYPE|20230502112233
        `,
      },
    };

    (processPatientData as jest.Mock).mockImplementation(() => {
      throw new Error("PRS segment is missing");
    });

    await parsePatientData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonResponse).toHaveBeenCalledWith({
      error: "PRS segment is missing",
    });
  });
});
