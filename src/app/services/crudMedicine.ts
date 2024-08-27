export const addMedicine = async(medicineData:any,uid:string)=>{
    try {
        const res = await fetch(`/api/crud-medicine?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicineData)
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}

export const getMedicines = async(uid:string)=>{
    try {
        const res = await fetch(`/api/crud-medicine?uid=${uid}`, {
            method: 'GET',
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}

export const delMedicines = async(id:string,uid:string)=>{
    try {
        const res = await fetch(`/api/crud-medicine?uid=${uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:id})
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}