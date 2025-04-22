
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

export interface DosageTypes {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
}

export interface MedicinesDetails {
    id: string,
    medicineName: string,
    instruction: string,
    dosages: DosageTypes,
    type: string
    duration: number,
    durationType: string,
}

export interface ReferDetails {
    hospitalName: string,
    doctorName: string,
    referMessage: string,
}

export interface ReceiptDetails {
    id: string;
    title: string;
    amount: number;
}

export interface PrescriptionFormTypes {
    prescription_id: string;
    orgId: string;
    prescription_for_bed: boolean;
    diseaseId: string;
    diseaseDetail: string;
    medicines: MedicinesDetails[];
    advice: string;
    nextVisit: string;
    refer: ReferDetails;
    created_at: number;
    registerd_by: orgUserType;
    prescribed_by: orgUserType;
    prescriber_assigned: orgUserType;
    receipt_details: ReceiptDetails[];
}

export interface MedicineItems extends MedicinesDetails {
    quantity: number;
    price: number;
}

export interface ServiceItems {
    service_id: string;
    service_name: string;
    quantity: number;
    price: number;
}

export interface PharmacyTypes {
    bill_id: string;
    prescription_id?: string;
    name: string;
    patient_id?: string;
    mobile: string;
    gender?: "Male" | "Female" | "Other";
    medicines: MedicineItems[];
    services: ServiceItems[];
    generated_at: number;
    prescribed_by?: orgUserType;
    generated_by: orgUserType;
    payment_status: "Paid" | "Unpaid" | "Not Required" | "Refunded";
    total_amount: number;
    discount: number;
    payment_method?: "Cash" | "Card" | "UPI" | "Online";
    tax_percentage: number;
    notes?: string;
}

export interface PharmacySelectedPatientType {
    name: string;
    patient_id?: string;
    mobile: string;
    gender?: "Male" | "Female" | "Other";
}