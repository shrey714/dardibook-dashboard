import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CreditCard } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubscriptionInfo from "../Settings/SubscriptionInfo";
import { getDocotr } from "@/app/services/getDoctor";
import { useAuth } from "@clerk/nextjs";

const SubscriptionDialogBtn = ({ className, ...props }: any) => {
  const [mainLoader, setmainLoader] = useState(false);
  const [doctorData, setdoctorData] = useState<any>({});
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    const setDocotrData = async () => {
      if (isLoaded && orgId) {
        setmainLoader(true);
        const doctorData = await getDocotr(orgId);
        if (doctorData.data) {
          setdoctorData(doctorData.data);
        } else {
          console.log("No data available for the provided DoctorID.");
        }
        setmainLoader(false);
      } else {
        setmainLoader(false);
      }
    };
    setDocotrData();
  }, [orgId, isLoaded]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props} className={className}>
          <CreditCard width={32} />
          Subscription
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseBtn={true}
        className="md:max-w-3xl overflow-y-auto max-h-full pt-0"
      >
        <DialogHeader>
          <DialogTitle hidden>
            Subscription Information (mm/dd/yyyy)
          </DialogTitle>
          <DialogDescription hidden>DESC</DialogDescription>
        </DialogHeader>

        <SubscriptionInfo
          subId={doctorData?.subscriptionId}
          mainLoader={mainLoader}
        />

        <DialogFooter className="justify-center sm:justify-center items-center flex-row flex-wrap gap-x-4 gap-y-2">
          <DialogClose asChild>
            <Button type="button" variant={"outline"} className="rounded-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialogBtn;
