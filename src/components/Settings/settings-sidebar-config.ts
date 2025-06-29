export const sidebarNavItems = [
    {
        title: "Profile",
        href: "/dashboard/settings",
        roles: [
            "org:clinic_head",
            "org:doctor",
            "org:assistant_doctor",
            "org:medical_staff",
        ],
    },
    {
        title: "Clinic",
        href: "/dashboard/settings/clinic",
        roles: ["org:clinic_head", "org:doctor"],
    },
    {
        title: "Defaults",
        href: "/dashboard/settings/defaults",
        roles: ["org:clinic_head", "org:doctor"],
    },
    {
        title: "Subscription",
        href: "/dashboard/settings/subscription",
        roles: ["org:clinic_head"],
    },
    {
        title: "DiseaseInfo",
        href: "/dashboard/settings/diseaseinfo",
        roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
    },
    {
        title: "MedicineInfo",
        href: "/dashboard/settings/medicineinfo",
        roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
    },
];