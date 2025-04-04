export const addBed = async (bedData: any) => {
  try {
    const res = await fetch("/api/crud-bed", {
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

export const deleteBed = async (bookingId: any) => {
  try {
    const res = await fetch("/api/crud-bed", {
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


export const checkBedAvailability = async ({uid}:any) => {
  try {
    const res = await fetch(`/api/crud-bed?uid=${uid}`);
    const data = await res.json();

    return { ...data, status: res?.status };
  } catch (error) {
    return { error: error };
  }
};
