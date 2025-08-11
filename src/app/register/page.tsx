"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseAuth, getDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import Link from "next/link";

interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactDetails: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  userType: "user" | "host";
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactDetails: "",
    description: "",
    githubUrl: "",
    linkedinUrl: "",
    userType: "user"
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    
    try {
      const auth = getFirebaseAuth();
      const db = getDb();
      
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);
      
      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        contactDetails: formData.contactDetails,
        description: formData.description,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        profileImageURL: "", // Will be set later
        role: formData.userType === "host" ? "organizer" : "user",
        userType: formData.userType,
        techStack: null,
        updatedAt: serverTimestamp(),
        isApproved: formData.userType === "user" // Users are auto-approved, hosts need approval
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log("User profile created successfully");
      
      toast.success("Registration successful! Please sign in.");
      router.push("/login");
      
    } catch (error: unknown) {
      console.error("Registration error:", error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          toast.error("An account with this email already exists");
        } else if (firebaseError.code === 'auth/weak-password') {
          toast.error("Password is too weak");
        } else if (firebaseError.code === 'auth/invalid-email') {
          toast.error("Invalid email address");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFD1A1] to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join ThriveUp today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                id="contactDetails"
                name="contactDetails"
                type="tel"
                value={formData.contactDetails}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Enter your contact number"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Bio/Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="Tell us about yourself"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="https://github.com/username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                placeholder="https://linkedin.com/in/username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5900] focus:border-transparent transition-colors"
                required
                disabled={isLoading}
              >
                <option value="user">User (Attend Events)</option>
                <option value="host">Host (Organize Events)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF5900] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#E54D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF5900] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
