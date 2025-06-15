"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { CirclePlus, InboxIcon, Pencil, SaveIcon } from "lucide-react";
import uniqid from "uniqid";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useAuth, useOrganization } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updateBillDefaults,
  updateServicesDefaults,
} from "@/app/dashboard/settings/defaults/_actions";

interface ServiceItems {
  service_id: string;
  service_name: string;
  price: number;
}

interface BillDefaultsType {
  discount: number;
  tax: number;
  payment_status: "Paid" | "Unpaid" | "Not Required" | "Refunded";
  payment_method: "Cash" | "Card" | "UPI" | "Online";
}

export const PharmacyOptions = () => {
  return (
    <>
      <BillDefaults />
      <Separator className="my-3" />
      <ServicesUpdateModal />
    </>
  );
};

const BillDefaults = () => {
  const [updateLoader, setUpdateLoader] = useState(false);
  const { organization, isLoaded } = useOrganization();

  const billDefaults = organization?.publicMetadata?.bill_defaults as
    | BillDefaultsType
    | undefined;

  const {
    discount = 0,
    tax = 0,
    payment_status = "Unpaid",
    payment_method = "Cash",
  } = billDefaults || {};

  // --------------add new receipt type-----------
  const updateDefaults = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoader(true);
    const form = e.target as HTMLFormElement;
    const billDefaults: BillDefaultsType = {
      discount: parseFloat(form.discount.value.trim()),
      tax: parseFloat(form.tax.value.trim()),
      payment_status: form.payment_status.value.trim(),
      payment_method: form.payment_method.value.trim(),
    };

    if (!organization) return;
    toast.promise(
      async () => {
        await updateBillDefaults(billDefaults).then(
          () => {
            organization.reload();
            setUpdateLoader(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setUpdateLoader(false);
          }
        );
      },
      {
        loading: "Updating Bill Defaults...",
        success: "Bill Defaults updated successfully",
        error: "Error Updating Bill Defaults",
      },
      {
        position: "bottom-right",
      }
    );
  };

  return (
    <Card className="bg-sidebar/70 w-full shadow-none border h-min mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="font-normal text-muted-foreground">
          Bill Defaults
        </CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent className="py-4 px-3 md:px-8">
        <form onSubmit={updateDefaults} autoComplete="off">
          <fieldset
            disabled={updateLoader}
            className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
          >
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="discount"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Discount (%)
              </label>
              <input
                className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="discount"
                id="discount"
                placeholder="e.g., 10"
                type="number"
                defaultValue={discount}
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="tax"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Tax (%)
              </label>
              <input
                className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="tax"
                id="tax"
                placeholder="e.g., 13"
                required
                defaultValue={tax}
                type="number"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                htmlFor="payment_status"
              >
                Payment Status
              </label>
              <select
                required
                id="payment_status"
                name="payment_status"
                defaultValue={payment_status}
                className="h-min mt-1 form-select disabled:opacity-100 w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Not Required">Not Required</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                htmlFor="payment_method"
              >
                Payment Method
              </label>
              <select
                required
                id="payment_method"
                name="payment_method"
                defaultValue={payment_method}
                className="h-min mt-1 form-select disabled:opacity-100 w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <Separator className="w-full col-span-6" />
            <div className="flex col-span-6 w-full items-center justify-end">
              <Button
                tabIndex={0}
                role="button"
                variant={"outline"}
                className="text-sm gap-2 px-6"
                type="submit"
              >
                <SaveIcon width={20} height={20} /> Save
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
};

const ServicesUpdateModal = () => {
  const { orgId } = useAuth();
  const { organization, isLoaded } = useOrganization();
  const [services, setServices] = useState<ServiceItems[]>([]);
  const [addLoader, setAddLoader] = useState(false);
  const [serviceEditModel, setServiceEditModel] = useState<boolean>(false);
  const [editForServiceId, setEditForServiceId] = useState<string>("");

  useEffect(() => {
    if (isLoaded && organization && organization.publicMetadata.services) {
      setServices(organization.publicMetadata.services as ServiceItems[]);
    } else {
      setServices([]);
    }
  }, [isLoaded, orgId, organization]);

  // --------------add new receipt type-----------
  const AddNewType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddLoader(true);
    const form = e.target as HTMLFormElement;
    const newService: ServiceItems = {
      service_id: uniqid(),
      service_name: form.service_name.value.trim(),
      price: parseInt(form.price.value.trim()),
    };
    if (!organization) return;
    toast.promise(
      async () => {
        await updateServicesDefaults(services.concat(newService)).then(
          () => {
            organization.reload();
            setAddLoader(false);
            form.reset();
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setAddLoader(false);
          }
        );
      },
      {
        loading: "Adding new service...",
        success: "New service added successfully",
        error: "Error adding new service",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------update receipt-----------
  const UpdateType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddLoader(true);
    const form = e.target as HTMLFormElement;
    const existingService: ServiceItems = {
      service_id: editForServiceId,
      service_name: form.service_name.value.trim(),
      price: parseInt(form.price.value.trim()),
    };
    if (!organization) return;
    toast.promise(
      async () => {
        await updateServicesDefaults(
          services.map((service) =>
            service.service_id === editForServiceId ? existingService : service
          )
        ).then(
          () => {
            organization.reload();
            setAddLoader(false);
            setServiceEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setAddLoader(false);
          }
        );
      },
      {
        loading: "Updating service...",
        success: "Service updated successfully",
        error: "Error updating service",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------delete receipt-----------
  const DeleteType = async () => {
    setAddLoader(true);
    if (!organization) return;
    toast.promise(
      async () => {
        await updateServicesDefaults(
          services.filter((service) => service.service_id !== editForServiceId)
        ).then(
          () => {
            organization.reload();
            setAddLoader(false);
            setServiceEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setAddLoader(false);
          }
        );
      },
      {
        loading: "Deleting service...",
        success: "Service deleted successfully",
        error: "Error deleting service",
      },
      {
        position: "bottom-right",
      }
    );
  };
  return (
    <>
      <Dialog open={serviceEditModel} onOpenChange={setServiceEditModel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Modify details for{" "}
              {
                services?.find(
                  (service) => service.service_id === editForServiceId
                )?.service_name
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={UpdateType} autoComplete="off">
            <fieldset
              disabled={addLoader}
              className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
            >
              <div className="col-span-6">
                <label
                  htmlFor="service_name"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Service Name
                </label>
                <input
                  className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="service_name"
                  id="service_name"
                  placeholder="e.g., Health Screenings"
                  required
                  defaultValue={
                    services?.find(
                      (service) => service.service_id === editForServiceId
                    )?.service_name
                  }
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="price"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Price (₹)
                </label>
                <input
                  className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="price"
                  id="price"
                  placeholder="e.g., 500"
                  required
                  type="number"
                  defaultValue={
                    services?.find(
                      (service) => service.service_id === editForServiceId
                    )?.price
                  }
                />
              </div>

              <Separator className="w-full col-span-6" />
              <div className="flex col-span-6 w-full items-center justify-between">
                <Button
                  role="button"
                  variant={"destructive"}
                  className="text-sm gap-2 px-6"
                  type="button"
                  onClick={DeleteType}
                >
                  Delete
                </Button>
                <Button
                  tabIndex={0}
                  role="button"
                  variant={"outline"}
                  className="text-sm gap-2 px-6"
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border border-b-0 rounded-b-none bg-sidebar/70 w-full shadow-none h-min mx-auto">
        <CardHeader className="border-b p-4">
          <CardTitle className="font-normal text-muted-foreground">
            Add New Service
          </CardTitle>
          <CardDescription hidden></CardDescription>
        </CardHeader>
        <CardContent className="py-4 px-3 md:px-8">
          <form onSubmit={AddNewType} autoComplete="off">
            <fieldset
              disabled={addLoader}
              className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="service_name"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Service Name
                </label>
                <input
                  className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="service_name"
                  id="service_name"
                  placeholder="e.g., Health Screenings"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="price"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Price (₹)
                </label>
                <input
                  className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="price"
                  id="price"
                  placeholder="e.g., 500"
                  required
                  type="number"
                />
              </div>

              <Separator className="w-full col-span-6" />
              <div className="flex col-span-6 w-full items-center justify-end">
                <Button
                  tabIndex={0}
                  role="button"
                  variant={"outline"}
                  className="text-sm gap-2 px-6"
                  type="submit"
                >
                  <CirclePlus width={20} height={20} /> Add
                </Button>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>
      <div className="rounded-t-none w-full flex flex-col flex-1 bg-sidebar/70 border rounded-md divide-y">
        {!isLoaded ? (
          <div className="flex flex-1 items-center justify-center min-h-72 w-full">
            <Loader size="medium" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72">
            <InboxIcon />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-12 pl-6">Id</TableHead>
                <TableHead className="h-12">Service</TableHead>
                <TableHead className="h-12">Price (₹)</TableHead>
                <TableHead className="h-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{index + 1}</TableCell>
                  <TableCell className="text-nowrap">
                    {service.service_name}
                  </TableCell>
                  <TableCell>₹{service.price}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant={"outline"}
                      className={`h-9 w-9 min-w-0`}
                      onClick={() => {
                        setServiceEditModel(true);
                        setEditForServiceId(service.service_id);
                      }}
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};
