export const createPrescription = async (req: any) => {

    // const payload = {
    //     id, uid,
    //     last_visited: "1234",
    //     deseaseDetail: "fdgsg",
    //     medicines: [{ medicineName: "med", instruction: "dvkjns", dosages: ["sfsv", "Sf"], duration: "sfdfb" }],
    //     advice: "sfv",
    //     nextVisit: "sdvkjsdn",
    //     refer: { hospitalName: "ksjvn", doctorName: "vdfgv", msg: "sdfvdk" }
    // }

    try {
        const res = await fetch(`/api/create-prescription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
};