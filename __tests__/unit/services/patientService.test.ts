import { extractPatientData } from "../../../src/services/patientService";

describe("extractPatientData", () => {
  it("should extract patient data correctly from a valid message", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    const expectedOutput = {
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A",
      },
      dateOfBirth: "1980-01-01",
      primaryCondition: "Common Cold",
    };

    expect(extractPatientData(message)).toEqual(expectedOutput);
  });

  it("should throw an error when PRS segment is missing", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    expect(() => extractPatientData(message)).toThrow("PRS segment is missing");
  });

  it("should throw an error when DET segment is missing", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|`;

    expect(() => extractPatientData(message)).toThrow("DET segment is missing");
  });

  it("should throw an error when required fields are missing in PRS", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    expect(() => extractPatientData(message)).toThrow(
      "PRS segment is malformed: Missing required name fields."
    );
  });

  it("should throw an error for an invalid date format", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|invalid_date|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold`;

    expect(() => extractPatientData(message)).toThrow(
      "PRS segment contains an invalid date of birth: invalid_date"
    );
  });

  it("should throw an error when admitting diagnosis is missing in DET", () => {
    const message = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|`;

    expect(() => extractPatientData(message)).toThrow(
      "DET segment is malformed: Missing admitting diagnosis."
    );
  });
});
