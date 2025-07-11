import { Disease } from "@/app/dashboard/settings/diseaseinfo/page";
import { CSVDisease } from "@/components/Settings/DiseaseInfo/DiseaseImportCSV";
import Papa from "papaparse";

// Convert diseases array to CSV format
export const exportDiseasesToCSV = (diseases: Disease[]): string => {
    const headers = ["Disease Name", "Medicines", "Disease ID"];
    const csvRows = [headers.join(",")];

    diseases.forEach((disease) => {
        const row = [
            `"${disease.diseaseDetail.replace(/"/g, '""')}"`, // Escape quotes
            `"${disease.medicines.join("; ").replace(/"/g, '""')}"`, // Join medicines with semicolon
            `"${disease.diseaseId.replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
};

// Generate sample CSV content
export const generateSampleCSV = (): string => {
    const sampleData: Disease[] = [
        {
            diseaseDetail: "Hypertension",
            medicines: ["medId1", "medId2", "medId3"],
            diseaseId: "sample-001",
            searchableString: "hypertension"
        },
        {
            diseaseDetail: "Diabetes Type 2",
            medicines: ["medId4", "medId5", "medId6"],
            diseaseId: "sample-002",
            searchableString: "diabetes type 2"
        },
        {
            diseaseDetail: "Asthma",
            medicines: ["medId7", "medId8", "medId9"],
            diseaseId: "sample-003",
            searchableString: "asthma"
        }
    ];

    return exportDiseasesToCSV(sampleData);
};

// Download CSV file
export const downloadCSV = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const processCSVFile = (
    file: File,
    existingDiseases: Disease[]
): Promise<{
    errors: string[];
    validRows: CSVDisease[];
    uniqueMedicines: string[];
}> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const errors: string[] = [];
                const validRows: CSVDisease[] = [];
                const uniqueMedicinesSet = new Set<string>();
                const csvDiseaseDetails = new Set<string>();

                const rows = results.data as any[];

                if (rows.length > 200) {
                    errors.push("CSV must contain fewer than 200 rows.");
                    return resolve({ errors, validRows, uniqueMedicines: [] });
                }

                rows.forEach((row, index) => {
                    const rowNumber = index + 2;

                    const diseaseDetail: string = row["Disease Name"]?.trim();
                    const medicineString: string = row["Medicines"]?.trim();

                    if (!diseaseDetail) {
                        errors.push(`Row ${rowNumber}: Disease Name is missing.`);
                        return;
                    }

                    if (csvDiseaseDetails.has(diseaseDetail)) {
                        errors.push(`Row ${rowNumber}: Duplicate Disease Name "${diseaseDetail}" in CSV.`);
                        return;
                    }

                    const alreadyExists = existingDiseases.some(
                        (d) => d.diseaseDetail.toLowerCase() === diseaseDetail.toLowerCase()
                    );

                    if (alreadyExists) {
                        errors.push(`Row ${rowNumber}: Disease Name "${diseaseDetail}" already exists.`);
                        return;
                    }

                    csvDiseaseDetails.add(diseaseDetail);

                    const medicines: string[] = medicineString
                        .split(";")
                        .map((m: string) => m.trim())
                        .filter((m: string) => m);

                    medicines.forEach((med) => uniqueMedicinesSet.add(med));

                    validRows.push({ diseaseDetail, medicines });
                });

                resolve({
                    errors,
                    validRows,
                    uniqueMedicines: Array.from(uniqueMedicinesSet),
                });
            },
            error: (error) => reject(error.message),
        });
    });
};
