import React, { useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StaffRolesRow from "./StaffRolesRow";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { addStaff, deleteStaff } from "@/app/services/crudStaff";

interface Staff {
  email: string;
  role: string;
}
const StaffRolesInfo = ({ staff, uid }: { staff: Staff[]; uid: string }) => {
  const [selectRole, setselectRole] = useState("subDoctor");
  const [allStaffs, setAllStaffs] = useState<Staff[]>(staff);
  const [searchStaff, setSearchStaff] = useState("");
  const [addLoader, setAddLoader] = useState(false);

  useEffect(() => {
    setAllStaffs(staff);
  }, [staff]);

  const filteredStaff = (staff: Staff[]) => {
    return staff
      ? staff.filter(
          (member: Staff) =>
            member?.email
              ?.toLowerCase()
              ?.includes(searchStaff?.toLowerCase()) &&
            member.role.toLowerCase() === selectRole.toLowerCase()
        )
      : [];
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let staffEmailInput = e.currentTarget.elements.namedItem(
      "staffEmail"
    ) as HTMLInputElement;
    const staffEmail = staffEmailInput.value.trim().toLowerCase();

    for (let staff of allStaffs) {
      if (staff.email.toLowerCase() === staffEmail) {
        toast.error(`Member already exists with role ${staff.role}!`, {
          duration: 2000,
          position: "top-right",
        });
        return;
      }
    }
    const newStaff = { email: staffEmail, role: selectRole };
    setAddLoader(true);
    const response = await addStaff(newStaff, uid);
    if (response.status === 200) {
      setAllStaffs([...allStaffs, newStaff]);
      setAddLoader(false);
      staffEmailInput.value = "";
    } else {
      setAddLoader(false);
      toast.error(`${response.error}`, {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  const deleteHandler = async (staffMailId: any) => {
    const response = await deleteStaff(staffMailId, uid);
    if (response.status === 200) {
      setAllStaffs(
        allStaffs.filter(
          (staff: { email: string }) => staff.email != staffMailId
        )
      );
    } else {
      toast.error(`${response.error}`, {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8 flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Manage staff roles
        </h3>
        <div className="drawer drawer-end w-auto static">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-3"
              className="drawer-button btn btn-primary btn-sm text-sm"
            >
              <h3 className="font-semibold leading-4 text-white tracking-wide">
                Show
              </h3>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content h-svh overflow-hidden flex-col w-full md:w-[70vw] lg:w-[60vw] p-4 pt-2 relative">
              {/* Sidebar content here */}
              {/*serach bar */}

              <div className="w-full mb-2 flex justify-end md:justify-start">
                <label
                  htmlFor="my-drawer-3"
                  className="drawer-button btn animate-none btn-circle btn-sm bg-gray-300"
                >
                  <XMarkIcon height={18} width={18} color="red" />
                </label>
              </div>

              <div role="tablist" className="tabs tabs-boxed bg-gray-300 gap-1">
                <button
                  onClick={() => setselectRole("subDoctor")}
                  role="tab"
                  className={`tab font-medium hover:bg-gray-50 ${
                    selectRole === "subDoctor" ? "tab-active" : ""
                  }`}
                >
                  SubDoctor
                </button>
                <button
                  onClick={() => setselectRole("medical")}
                  role="tab"
                  className={`tab font-medium hover:bg-gray-50 ${
                    selectRole === "medical" ? "tab-active" : ""
                  }`}
                >
                  Medical
                </button>
              </div>

              <form
                className="px-1 my-2 py-1 flex items-center flex-row gap-1 w-full bg-gray-300 rounded-lg"
                onSubmit={submitHandler}
              >
                <input
                  type="email"
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="staffEmail"
                  id="staffEmail"
                  placeholder="Member email id.."
                  required
                />
                <button
                  tabIndex={0}
                  role="button"
                  className="btn-square animate-none m-auto bg-primary border-0 btn btn-primary btn-sm text-sm"
                  type="submit"
                  disabled={addLoader}
                >
                  {addLoader ? (
                    <Loader
                      size="small"
                      color="text-primary"
                      secondaryColor="text-gray-300"
                    />
                  ) : (
                    <PlusIcon width={20} height={20} color="white" />
                  )}
                </button>
              </form>

              <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    ></path>
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    id="searchStaff"
                    placeholder="Search by member email.."
                    value={searchStaff}
                    onChange={(e) => {
                      setSearchStaff(e.target.value);
                    }}
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10"
                  />
                </div>
              </div>

              {/* diaplay disease */}
              <div className="w-full flex flex-col flex-1 bg-gray-300 mt-1 p-2 pb-1 rounded-lg overflow-y-auto">
                {filteredStaff(allStaffs).length === 0 ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      empty
                    </div>
                  </>
                ) : (
                  <>
                    {filteredStaff(allStaffs).map(
                      (staff: Staff, index: number) => {
                        return (
                          <StaffRolesRow
                            key={index}
                            index={index}
                            staff={staff}
                            deleteHandler={deleteHandler}
                          />
                        );
                      }
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRolesInfo;
