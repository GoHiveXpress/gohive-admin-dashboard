// src/types/riderManagement/index.ts
export type RiderProfile = {
  vehicleType: "Motorbike" | "Bicycle" | "Car" | "Van";
  vehiclePlateNumber: string;
  driversLicenseImage: string;
  passportPhoto: string;
  vehicleImage: string;
  availabilityStatus: "online" | "offline" | "busy";
  verificationStatus: "pending" | "approved" | "rejected";
  isApproved: boolean;
};

export type BankDetails = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
};

export type RiderUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "rider";
  profilePicture: string;
  riderProfile: RiderProfile;
  bankDetails?: BankDetails;
  createdAt: string;
};

export type RiderListResponse = {
  success: boolean;
  data: RiderUser[];
};

export type SingleRiderResponse = {
  success: boolean;
  data: RiderUser;
};