//src/types/vendorManagement/index.ts
export type OperatingHours = {
  day: string;
  openTime: string;
  closeTime: string; 
  is24Hours: boolean;
  isOpen: boolean;
};

export type VendorProfile = {
  businessName: string;
  businessType: string;
  businessAddress: string;
  cacNumber: string;
  govtIdImage: string;
  passportPhoto: string;
  operatingHours: OperatingHours[];
  verificationStatus: "pending" | "approved" | "rejected";
  isApproved: boolean;
};

export type BankDetails = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
};

export type VendorUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "vendor";
  profilePicture: string;
  vendorProfile: VendorProfile;
  bankDetails?: BankDetails;
  createdAt: string;
};

export type VendorListResponse = {
  success: boolean;
  data: VendorUser[];
};

export type SingleVendorResponse = {
  success: boolean;
  data: VendorUser;
};