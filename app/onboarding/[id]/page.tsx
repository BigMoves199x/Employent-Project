import OnboardingForm from "@/app/ui/onboarding-form";
import LoadingSpinner from "@/app/ui/loading-spinner";
import { Suspense } from "react";


export type paramsType = Promise<{ id: string }>;

export default async function OnboardingPage(props: { params: paramsType }) {
  
  const { id } = await props.params;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingForm applicantId={id} />
      </Suspense>
    </div>
  );
}
