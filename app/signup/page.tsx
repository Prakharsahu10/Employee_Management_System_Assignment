"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Briefcase,
  Users,
  BarChart3,
  Shield,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login?message=Account created successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Side - Signup Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <motion.div
            className="text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex justify-center">
              <motion.div
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Briefcase className="size-7 text-white" />
              </motion.div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join EMS and start managing efficiently
            </p>
          </motion.div>

          {/* Signup Form */}
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSignup}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="john.doe@company.com"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="johndoe"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </motion.button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </span>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Side - Employee Management Benefits */}
      <motion.div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-green-50 to-blue-100 items-center justify-center relative overflow-hidden"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="max-w-lg text-center z-10">
          <motion.div
            className="grid grid-cols-1 gap-6 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg flex items-center space-x-4"
              whileHover={{ scale: 1.03, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle className="size-8 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Easy Onboarding</h3>
                <p className="text-sm text-gray-600">Get started in minutes</p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg flex items-center space-x-4"
              whileHover={{ scale: 1.03, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Users className="size-8 text-blue-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">
                  Team Collaboration
                </h3>
                <p className="text-sm text-gray-600">
                  Work together seamlessly
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg flex items-center space-x-4"
              whileHover={{ scale: 1.03, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <BarChart3 className="size-8 text-purple-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">
                  Real-time Insights
                </h3>
                <p className="text-sm text-gray-600">Data-driven decisions</p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg flex items-center space-x-4"
              whileHover={{ scale: 1.03, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Shield className="size-8 text-red-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Data Protection</h3>
                <p className="text-sm text-gray-600">Your data is secure</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Join Thousands of Organizations
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Transform how you manage your workforce with our comprehensive
            platform
          </motion.p>
        </div>

        {/* Background decorative elements */}
        <motion.div
          className="absolute top-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-50"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-40"
          animate={{
            y: [0, -10, 0],
            x: [0, 8, 0],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
