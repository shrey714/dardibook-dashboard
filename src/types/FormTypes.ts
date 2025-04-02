
export interface orgUserType {
    id: string;
    name: string;
    email: string;
}

export interface patientBed {
    bedId: string;
    bedBookingId: string;
    admission_at: number;
    admission_by: orgUserType;
    admission_for: orgUserType;
    discharge_at: number;
    dischargeMarked: boolean;
    discharged_by: orgUserType;
}
export interface RegisterPatientFormTypes {
    patient_id: string;
    name: string;
    mobile: string;
    gender: "Male" | "Female" | "Other";
    age: string;
    street_address: string;
    city: string;
    state: string;
    zip: string;
    registered_date: number[];
    registered_date_time: number[];
    prescribed_date_time: number[];
    bed_info: patientBed[];
    registerd_by: orgUserType;
    registerd_for: orgUserType;
}

export interface ScheduledPatientTypes {
    patient_id: string;
    name: string;
    mobile: string;
    gender: "Male" | "Female" | "Other";
    registered_date: number[];
    registered_date_time: number[];
    registerd_by: orgUserType;
    registerd_for: orgUserType;
}

export interface BedPatientTypes {
    patient_id: string;
    name: string;
    mobile: string;
    gender: "Male" | "Female" | "Other";
    age: string;
    bed_info: patientBed[];
}

export interface OrgBed {
    bedBookingId: string;
    bedId: string;
    patient_id: string;
    admission_at: number;
    admission_by: orgUserType;
    admission_for: orgUserType;
    discharge_at: number;
    dischargeMarked: boolean;
    discharged_by: orgUserType;
}

export interface TodayPatientsType {
    patient_id: string;
    name: string;
    mobile: string;
    gender: "Male" | "Female" | "Other";
    registered_date: number[];
    registered_date_time: number[];
    registerd_by: orgUserType;
    registerd_for: orgUserType;
    prescribed: boolean;
    inBed: boolean;
}