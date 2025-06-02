interface RegistrationData {
  patient_id: string;
  name: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  age: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  registered_at: number;
  registerd_by: string;
  registerd_for: string;
}

interface PrescriptionData {
  patient_id: string;
  name: string;
  prescription_id: string;
  prescription_for_bed: boolean;
  diseaseDetail: string;
  medicines: {
    medicineName: string,
    instruction: string,
    dosages: {
      morning: string;
      afternoon: string;
      evening: string;
      night: string;
    },
    type: string
    duration: number,
    durationType: string,
  }[];
  advice: string;
  nextVisit: string;
  refer: {
    hospitalName: string,
    doctorName: string,
    referMessage: string,
  };
  created_at: number;
  registerd_by: string;
  prescribed_by: string;
  prescriber_assigned: string;
  receipt_details: {
    title: string;
    amount: number;
  }[];
}

interface BillData {
  patient_id?: string;
  name: string;
  bill_id: string;
  prescription_id?: string;
  mobile: string;
  gender?: "Male" | "Female" | "Other";
  medicines: {
    medicineName: string;
    instruction: string;
    dosages: {
      morning: string;
      afternoon: string;
      evening: string;
      night: string;
    };
    type: string;
    duration?: number;
    durationType?: string;
    quantity: number;
    price: number;
  }[];
  services: {
    service_name: string;
    quantity: number;
    price: number;
  }[];
  generated_at: number;
  prescribed_by?: string;
  generated_by: string;
  payment_status: "Paid" | "Unpaid" | "Not Required" | "Refunded";
  total_amount: number;
  discount: number;
  payment_method?: "Cash" | "Card" | "UPI" | "Online";
  tax_percentage: number;
  notes?: string;
}