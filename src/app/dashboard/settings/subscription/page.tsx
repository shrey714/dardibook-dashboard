import BillActivity from "@/components/Settings/SubscriptionInfo/BillActivity";
import SubscriptionDetails from "@/components/Settings/SubscriptionInfo/SubscriptionDetails";

export default function UserBilling() {
  return (
    <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <div className="h-min w-full mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
        <SubscriptionDetails />
      </div>

      <div className="flex flex-col mt-2 sm:mt-5 2xl:mt-0 mx-auto 2xl:mx-0 max-w-4xl gap-2 w-full">
        <BillActivity />
      </div>
    </div>
  );
}
