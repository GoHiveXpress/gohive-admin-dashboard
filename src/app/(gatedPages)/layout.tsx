//src/app/(gatedPages)/layout.tsx
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";

export default function GatedPagesLayout({ children }: { children: React.ReactNode }) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
