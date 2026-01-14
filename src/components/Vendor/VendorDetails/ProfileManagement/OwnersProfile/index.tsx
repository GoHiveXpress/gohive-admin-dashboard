"use client";

import FloatingInput from "@/components/FormElements/FloatingInput";

export default function OwnersProfile() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FloatingInput
                label="Full Name"
                defaultValue="Victor Kenny"
                icon="ph:user-fill"
            />

            <FloatingInput
                label="Phone Number"
                defaultValue="09056113019"
                icon="ph:phone-fill"
            />

            <FloatingInput
                label="Email"
                defaultValue="victorkenny@gmail.com"
                icon="ph:envelope-simple-fill"
            />

            <FloatingInput
                label="Passport Phot"
                readOnly
                placeholder="Upload"
                icon="ph:upload-simple-bold"
                className="cursor-pointer"
            />

            <FloatingInput
                label="Government-issued ID upload"
                readOnly
                placeholder="Upload"
                icon="ph:upload-simple-bold"
                className="cursor-pointer"
            />
        </div>
    );
}