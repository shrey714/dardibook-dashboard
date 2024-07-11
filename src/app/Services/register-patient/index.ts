export const RegisterPatient = async(req:any)=>{
    try {
        const res = await fetch(`/api/register-patient`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
          });
          const data = await res.json();
          console.log(data,"oza")
          return data;
    } catch (error) {
        return {error:error}
    }

}