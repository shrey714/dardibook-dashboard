import React, { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CircleX, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { createOrganization } from "@/lib/actions/createOrganization";

// Type definitions
interface FormData {
  clinicName: string;
  doctorName: string;
  degree: string;
  registrationNumber: string;
  clinicNumber: string;
  phoneNumber: string;
  clinicAddress: string;
  clinicLogo: File | null;
  signaturePhoto: File | null;
}

interface FileUploadFieldProps {
  fieldName: keyof FormData;
  label: string;
  preview: string | null;
  accept?: string;
}

// Validation schema using Zod
const formSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  doctorName: z.string().min(2, "Doctor name must be at least 2 characters"),
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  registrationNumber: z
    .string()
    .min(3, "Registration number must be at least 3 characters"),
  clinicNumber: z
    .string()
    .regex(/^\d+$/, "Clinic number must contain only digits"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  clinicAddress: z
    .string()
    .min(10, "Clinic address must be at least 10 characters"),
  clinicLogo: z.instanceof(File, { message: "Clinic logo is required" }),
  signaturePhoto: z.instanceof(File, {
    message: "Signature photo is required",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const RegistrationForm: React.FC = () => {
  const [clinicLogoPreview, setClinicLogoPreview] = useState<string | null>(
    null
  );
  const [signaturePhotoPreview, setSignaturePhotoPreview] = useState<
    string | null
  >(null);
  const [submissionLoader, setSubmissionLoader] = useState<boolean>(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicName: "",
      doctorName: "",
      degree: "",
      registrationNumber: "",
      clinicNumber: "",
      phoneNumber: "",
      clinicAddress: "",
      clinicLogo: undefined,
      signaturePhoto: undefined,
    },
  });

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormData
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "clinicLogo") {
          setClinicLogoPreview(reader.result as string);
        } else if (fieldName === "signaturePhoto") {
          setSignaturePhotoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      form.setValue(fieldName, file);
    }
  };

  const handleRemoveImage = (fieldName: keyof FormData): void => {
    form.resetField(fieldName);
    if (fieldName === "clinicLogo") {
      setClinicLogoPreview(null);
    } else if (fieldName === "signaturePhoto") {
      setSignaturePhotoPreview(null);
    }
  };

  const onSubmit = async (formData: FormSchemaType): Promise<void> => {
    setSubmissionLoader(true);
    try {
      const result = await createOrganization(formData);
      if (result?.status === 200) {
        setSubmissionLoader(false);
        window.location.reload();
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        position: "bottom-right",
      });
      console.error("Submission error:", error);
    } finally {
      setSubmissionLoader(false);
    }
  };

  const FileUploadField: React.FC<FileUploadFieldProps> = ({
    fieldName,
    label,
    preview,
    accept = "image/*",
  }) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem>
          <FormLabel>
            {label}
            <span className="text-destructive ml-1">*</span>
          </FormLabel>
          <FormControl>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-8">
              <div className="text-center">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt={label}
                      className="mx-auto h-24 w-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => handleRemoveImage(fieldName)}
                    >
                      <CircleX className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4 flex text-sm leading-6">
                      <Label
                        htmlFor={fieldName}
                        className="relative flex-col w-full text-center cursor-pointer font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload {label}</span>
                        <Input
                          id={fieldName}
                          type="file"
                          className="sr-only"
                          accept={accept}
                          onChange={(e) => handleFileChange(e, fieldName)}
                        />
                      </Label>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Recommend size 1:1, up to 2mb (PNG, JPG)
                    </p>
                  </>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <fieldset
          disabled={submissionLoader}
          className="grid grid-cols-12 gap-6"
        >
          {/* Clinic Name */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="clinicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Clinic Name
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter clinic name"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Doctor Name */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Doctor Name
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter doctor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Degree */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Degree
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter degree (e.g., MBBS, MD)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Registration Number */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Registration Number
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Clinic Number */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="clinicNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Clinic Number
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter clinic number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Phone Number */}
          <div className="col-span-12 sm:col-span-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Clinic Address */}
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="clinicAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Clinic Address
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter complete clinic address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Clinic Logo */}
          <div className="col-span-12 sm:col-span-6">
            <FileUploadField
              fieldName="clinicLogo"
              label="Clinic Logo"
              preview={clinicLogoPreview}
            />
          </div>

          {/* Signature Photo */}
          <div className="col-span-12 sm:col-span-6">
            <FileUploadField
              fieldName="signaturePhoto"
              label="Signature Photo"
              preview={signaturePhotoPreview}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="col-span-12">
            <p className="text-xs sm:text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a
                href="https://dardibook.in/documents/terms-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                terms and conditions
              </a>{" "}
              and{" "}
              <a
                href="https://dardibook.in/documents/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                privacy policy
              </a>
              .
            </p>
          </div>

          {/* Submit Button */}
          <div className="col-span-12 flex justify-center">
            <Button
              type="submit"
              disabled={submissionLoader}
              className="w-full max-w-md h-10 text-base font-semibold rounded-full"
              variant="default"
            >
              {submissionLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Clinic"
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default RegistrationForm;
