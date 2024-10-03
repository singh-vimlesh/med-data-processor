export interface PatientData {
  fullName: {
    lastName: string;
    firstName: string;
    middleName?: string;
  };
  dateOfBirth: string;
  primaryCondition: string;
}

export const SEGMENT_PREFIXES = {
  PRS: 'PRS',
  DET: 'DET',
};

export const PRS_FIELDS = {
  NAME: 4, // 4th field for full name (lastName^firstName^middleName)
  DOB: 8, // 8th field for date of birth
};

export const DET_FIELDS = {
  CONDITION: 4, // 4th field for primary condition
};
