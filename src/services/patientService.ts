import { saveToMockDatabase } from '../data/mockDatabase';
import { DET_FIELDS, PatientData, PRS_FIELDS, SEGMENT_PREFIXES } from '../models/patient';
import { isValidISODate } from '../utils/dateUtils';
import { getField } from '../utils/stringUtils';

export function processPatientData(message: string): PatientData {
  // Use the extractPatientData function to get the data
  const extractedData = extractPatientData(message);

  // Save the extracted data to the mock database
  saveToMockDatabase(extractedData);

  return extractedData;
}

/**
 * Parses the input message and extracts patient-related data.
 * @param message - The input plain-text message in a specific format.
 * @returns An object containing extracted patient data.
 * @throws Error if required fields are missing or malformed.
 */
export function extractPatientData(message: string): PatientData {
  // Split the message into segments and clean up whitespace.
  const segments = message
    .split('\n')
    .map((seg) => seg.trim())
    .filter((seg) => !!seg); // Remove empty segments

  // Extract the PRS and DET segments using their prefixes.
  const prsSegment = segments.find((segment) => segment.startsWith(SEGMENT_PREFIXES.PRS));
  const detSegment = segments.find((segment) => segment.startsWith(SEGMENT_PREFIXES.DET));

  // If PRS or DET segments are missing, throw an error with a clear message.
  if (!prsSegment) throw new Error('PRS segment is missing in the message.');
  if (!detSegment) throw new Error('DET segment is missing in the message.');

  // Parse the PRS segment fields
  const prsFields = prsSegment.split('|');
  const [lastName, firstName, middleName] = getField(prsFields, PRS_FIELDS.NAME)
    .split('^')
    .map((field) => field.trim()); // Trim each part to remove extra spaces

  // Check if the required name fields are present
  if (!lastName || !firstName) {
    throw new Error(
      `PRS segment is malformed: Missing required name fields. Received: ${
        prsFields[PRS_FIELDS.NAME]
      }`
    );
  }

  // Extract and validate date of birth from the PRS segment
  const dateOfBirthRaw = getField(prsFields, PRS_FIELDS.DOB);
  if (!dateOfBirthRaw) {
    throw new Error(
      `PRS segment is malformed: Missing date of birth. Received: ${prsFields.join('|')}`
    );
  }

  // Format date of birth to ISO format (YYYY-MM-DD)
  const dateOfBirth = `${dateOfBirthRaw.slice(0, 4)}-${dateOfBirthRaw.slice(
    4,
    6
  )}-${dateOfBirthRaw.slice(6, 8)}`;

  // Validate the formatted date of birth
  if (!isValidISODate(dateOfBirth)) {
    throw new Error(`PRS segment contains an invalid date of birth: ${dateOfBirthRaw}`);
  }

  // Parse the DET segment fields
  const detFields = detSegment.split('|');
  const primaryCondition = getField(detFields, DET_FIELDS.CONDITION);

  // Check if the primary condition is present
  if (!primaryCondition) {
    throw new Error('DET segment is malformed: Missing admitting diagnosis.');
  }

  // Return the extracted patient data in the expected format
  return {
    fullName: { lastName, firstName, middleName },
    dateOfBirth,
    primaryCondition,
  };
}
