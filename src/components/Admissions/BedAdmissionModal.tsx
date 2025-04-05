import React, { useCallback, useEffect } from 'react'
import { Button } from '../ui/button'
import AsyncCreatableSelect from 'react-select/async-creatable';
import { ArrowUpRight } from 'lucide-react';
import router from 'next/router';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, or, and, where, getDocs } from 'firebase/firestore';
import { useTodayPatientStore } from '@/lib/providers/todayPatientsProvider';

function BedAdmissionModal() {
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  useEffect(()=>{
    console.log(todayPatients)
  },[loading])
  return (
    <div>
      
      <Button>Jeet</Button>
    </div>
  )
}

export default BedAdmissionModal
