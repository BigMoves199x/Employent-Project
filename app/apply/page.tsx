import ApplicantForm from "../ui/applicant-form";
import LoadingSpinner from "@/app/ui/LoadingOverlay";
import { Suspense } from "react";

export default function ApplyPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <ApplicantForm />
      </Suspense>
    </div>
  );
}
 


     
