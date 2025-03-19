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
    bed_info: []
}