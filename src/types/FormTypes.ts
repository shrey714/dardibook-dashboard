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
    bed_info: [];
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

export interface orgUserType {
    id: string;
    name: string;
    email: string;
}