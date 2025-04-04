export const addBooking = async (bedData: any) => {
    try {
      const res = await fetch("/api/crud-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bedData),
      });
      const data = await res.json();
  
      return { ...data, status: res?.status };
    } catch (error) {
      return { error: error };
    }
  };
  
  export const dischargePatientFromBed = async (bookingId: any) => {
    try {
      const res = await fetch("/api/crud-booking", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingId),
      });
      const data = await res.json();
  
      return { ...data, status: res?.status };
    } catch (error) {
      return { error: error };
    }
  };
  