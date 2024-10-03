import { PatientData } from '../models/patient';

const mockDatabase: PatientData[] = [];

export function saveToMockDatabase(parsedData: PatientData): void {
  mockDatabase.push(parsedData);
  console.log('Data saved to mock database:', parsedData);
}

export function getMockDatabase(): PatientData[] {
  return mockDatabase;
}
