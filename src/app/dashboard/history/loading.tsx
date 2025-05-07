import Loader from "@/components/common/Loader";

export default function Loading() {
  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <Loader size="medium" />
    </div>
  );
}
