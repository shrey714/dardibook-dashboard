
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
    discharged_by?: orgUserType;
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
    discharged_by?: orgUserType;
}

export interface BedInfo {
    bed_id: string;
    ward: string;
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

export interface PrescriptionAdditionalinfo{
    id: string;
    label: string;
    value: string;
}

export interface UploadedFileInfo {
    name: string;
    url: string;
  };

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
    prescription_additional_details: PrescriptionAdditionalinfo[];
    attachments?: File[];
    attachments_data?: UploadedFileInfo[];
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

type BasePatientInfo = {
    patient_id: string;
    patient_name?: string;
};

export type CalendarEventTypes =
    | (BasePatientInfo & {
        event_type: "appointment";
        appointment_details: {
            registered_at: number;
            prescribed: boolean;
            prescribed_at?: number;
        };
        bed_details?: never;
    })
    | (BasePatientInfo & {
        event_type: "bed";
        bed_details: {
            admission_by: string;
            admission_for: string;
            bedId: string;
            admission_at: number;
            discharge_at: number;
            dischargeMarked: boolean;
            discharged_by?: string;
        };
        appointment_details?: never;
    });




// Dashboard Types

export interface StatComparison {
    title: string;
    info: string;
    count: number;
    percentage: number;
    status: "increase" | "decrease";
    dayCount: number[];
}

export interface WeeklyDoctorComparison {
    title: string;
    desc: string;
    dayCount: {
        doctor: string;
        lastWeek: number;
        currentWeek: number;
    }[];
}

export interface BedPatient {
    bedBookingId: string;
    bedId: string;
    patientId: string;
    admissionAt: number;
    dischargeAt: number;
    admissionFor: string;
}

export interface Appointment {
    patientId: string;
    name: string;
    dateTime: number;
    registeredFor: string;
}

export interface ActivityLog {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: number;
}

export interface DashboardDataTypes {
    compareStats: {
        newPatients: StatComparison;
        totalAppointments: StatComparison;
        totalBills: StatComparison;
        totalRevenue: StatComparison;
    };
    doctorWeeklyComparison: WeeklyDoctorComparison;
    patientsInBed: BedPatient[];
    upcomingAppointments: Appointment[];
    recentActivities: ActivityLog[];
}
