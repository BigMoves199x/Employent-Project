"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import LoadingOverlay from "@/app/ui/LoadingOverlay";

export default function ApplicantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 512 * 1024) {
      alert("File is too large. Max size is 512KB.");
      return;
    }
    setForm((prev) => ({ ...prev, resume: file || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.resume) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true); 

    try {
      const file = form.resume;
      const filePath = `${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert("Resume upload failed.");
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(filePath);

      const resume_url = publicUrlData.publicUrl;

      // Send form data to your API route
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, resume_url }),
      });

      if (res.ok) {
        router.push("/apply/success");
      } else {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong with your application.");
    } finally {
      setLoading(false); // ✅ Stop loading spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 relative">
      {/* Overlay when loading */}
      {loading && <LoadingOverlay />}

      <div className="bg-[#072a40] text-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">Apply Now</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
        >
          {/* First Name */}
          <div>
            <label className="block text-white mb-1">First Name *</label>
            <input
              name="first_name"
              type="text"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-white mb-1">Last Name *</label>
            <input
              name="last_name"
              type="text"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white mb-1">Email Address *</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white mb-1">Phone *</label>
            <input
              name="phone"
              type="tel"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Resume Upload */}
          <div className="md:col-span-2">
            <label className="block text-white mb-1">Resume Upload *</label>
            <input
              name="resume"
              type="file"
              accept=".pdf,.docx,.doc"
              required
              onChange={handleFileChange}
              className="w-full text-white file:bg-white file:text-black file:px-4 file:py-2 file:rounded file:border file:border-gray-300"
            />
            <p className="text-sm text-white mt-1">
              Accepted formats: <code>.pdf</code>, <code>.docx</code>,{" "}
              <code>.doc</code>. Max file size: 512KB.
            </p>
          </div>

          {/* Checkbox Agreement */}
          <div className="md:col-span-2">
            <div className="flex items-start space-x-2 mt-4">
              <input type="checkbox" required className="mt-1" />
              <p className="text-sm text-white">
                <strong>By checking this box, you authorize us</strong>, our
                service providers, or affiliates to contact you for marketing or
                advertising purposes using SMS or phone calls.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
