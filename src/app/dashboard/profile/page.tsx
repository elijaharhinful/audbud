"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateUserProfile } from "@/store/authSlice";
import {
  User,
  Mail,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Camera,
  Save,
  X,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, updateLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const {toasts, removeToast, showSuccess, showError} = useToast();

  const [isDark, setIsDark] = useState(false);
  const [accentColor, setAccentColor] = useState("#65a30d");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    salary: "",
    familySize: "",
    avatarUrl: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        location: user.user_metadata?.location || "",
        salary: user.user_metadata?.salary || "",
        familySize: user.user_metadata?.familySize || "",
        avatarUrl: user.user_metadata?.avatarUrl || "",
      });
    }
  }, [user]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      showSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError(error instanceof Error ? error.message : "Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        location: user.user_metadata?.location || "",
        salary: user.user_metadata?.salary || "",
        familySize: user.user_metadata?.familySize || "",
        avatarUrl: user.user_metadata?.avatarUrl || "",
      });
    }
    setIsEditing(false);
  };

  const getUserInitials = () => {
    const name = formData.name || formData.email;
    if (!name) return "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSalary = (salary: string) => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(salary));
  };

  const getJoinedDate = () => {
    if (!user?.created_at) return "Unknown";
    return new Date(user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Don't render profile page if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"} ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      } transition-colors`}
    >
      <div className="flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isDark={isDark}
          accentColor={accentColor}
          user={user}
        />

        <div className="flex-1 flex flex-col">
          <Header
            isDark={isDark}
            accentColor={accentColor}
            toggleTheme={toggleTheme}
            setAccentColor={setAccentColor}
            title="Profile"
            subtitle="Manage your account settings and preferences."
          />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <div
                className={`${
                  isDark ? "bg-gray-900" : "bg-white"
                } rounded-lg shadow-sm p-6 mb-6`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        {formData.avatarUrl ? (
                          <img
                            src={formData.avatarUrl}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {getUserInitials()}
                          </span>
                        )}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                          <Camera
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </button>
                      )}
                    </div>

                    <div>
                      <h1
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formData.name || "User"}
                      </h1>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formData.email}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        } mt-1`}
                      >
                        Member since {getJoinedDate()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={updateLoading}
                          className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${
                            updateLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:opacity-90"
                          }`}
                          style={{ backgroundColor: accentColor }}
                        >
                          {updateLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="mr-2" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className={`flex items-center px-4 py-2 ${
                            isDark
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          } rounded-lg transition-colors cursor-pointer`}
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div
                className={`${
                  isDark ? "bg-gray-900" : "bg-white"
                } rounded-lg shadow-sm mb-6`}
              >
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: "personal", label: "Personal Info", icon: User },
                      {
                        id: "financial",
                        label: "Financial Info",
                        icon: DollarSign,
                      },
                      { id: "security", label: "Security", icon: Shield },
                      {
                        id: "notifications",
                        label: "Notifications",
                        icon: Bell,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm cursor-pointer ${
                          activeTab === tab.id
                            ? `text-white border-b-2`
                            : `border-transparent ${
                                isDark
                                  ? "text-gray-400 hover:text-gray-300"
                                  : "text-gray-500 hover:text-gray-700"
                              }`
                        }`}
                        style={
                          activeTab === tab.id
                            ? {
                                borderBottomColor: accentColor,
                                color: accentColor,
                              }
                            : {}
                        }
                      >
                        <tab.icon size={16} className="mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "personal" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent cursor-pointer ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                              style={
                                {
                                  "--tw-ring-color": accentColor,
                                  focusRingColor: accentColor,
                                } as React.CSSProperties
                              }
                              onFocus={(e) =>
                                (e.target.style.boxShadow = `0 0 0 2px ${accentColor}`)
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            />
                          ) : (
                            <div
                              className={`flex items-center px-3 py-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-50"
                              } rounded-lg`}
                            >
                              <User size={16} className="mr-2 text-gray-400" />
                              {formData.name || "Not specified"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            Email
                          </label>
                          <div
                            className={`flex items-center px-3 py-2 ${
                              isDark ? "bg-gray-800" : "bg-gray-50"
                            } rounded-lg`}
                          >
                            <Mail size={16} className="mr-2 text-gray-400" />
                            {formData.email}
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            Location
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent cursor-pointer ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                              style={
                                {
                                  "--tw-ring-color": accentColor,
                                  focusRingColor: accentColor,
                                } as React.CSSProperties
                              }
                              onFocus={(e) =>
                                (e.target.style.boxShadow = `0 0 0 2px ${accentColor}`)
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            />
                          ) : (
                            <div
                              className={`flex items-center px-3 py-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-50"
                              } rounded-lg`}
                            >
                              <MapPin
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              {formData.location || "Not specified"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            Family Size
                          </label>
                          {isEditing ? (
                            <select
                              name="familySize"
                              value={formData.familySize}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent cursor-pointer ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                              style={
                                {
                                  "--tw-ring-color": accentColor,
                                  focusRingColor: accentColor,
                                } as React.CSSProperties
                              }
                              onFocus={(e) =>
                                (e.target.style.boxShadow = `0 0 0 2px ${accentColor}`)
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            >
                              <option value="">Select family size</option>
                              <option value="1">1 person</option>
                              <option value="2">2 people</option>
                              <option value="3">3 people</option>
                              <option value="4">4 people</option>
                              <option value="5">5+ people</option>
                            </select>
                          ) : (
                            <div
                              className={`flex items-center px-3 py-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-50"
                              } rounded-lg`}
                            >
                              <Users size={16} className="mr-2 text-gray-400" />
                              {formData.familySize
                                ? `${formData.familySize} ${
                                    formData.familySize === "1"
                                      ? "person"
                                      : "people"
                                  }`
                                : "Not specified"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "financial" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            Monthly Salary
                          </label>
                          {isEditing ? (
                            <input
                              type="number"
                              name="salary"
                              value={formData.salary}
                              onChange={handleInputChange}
                              placeholder="Enter your monthly salary"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent cursor-pointer ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                              style={
                                {
                                  "--tw-ring-color": accentColor,
                                  focusRingColor: accentColor,
                                } as React.CSSProperties
                              }
                              onFocus={(e) =>
                                (e.target.style.boxShadow = `0 0 0 2px ${accentColor}`)
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            />
                          ) : (
                            <div
                              className={`flex items-center justify-between px-3 py-2 ${
                                isDark ? "bg-gray-800" : "bg-gray-50"
                              } rounded-lg`}
                            >
                              <div className="flex items-center">
                                <DollarSign
                                  size={16}
                                  className="mr-2 text-gray-400"
                                />
                                {showSalary
                                  ? formatSalary(formData.salary)
                                  : "••••••"}
                              </div>
                              <button
                                onClick={() => setShowSalary(!showSalary)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                {showSalary ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <Shield
                          size={48}
                          className="mx-auto text-gray-400 mb-4"
                        />
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          Security Settings
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Security settings are managed through your
                          authentication provider.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <Bell
                          size={48}
                          className="mx-auto text-gray-400 mb-4"
                        />
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          Notification Preferences
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Notification settings will be available in a future
                          update.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
          <ToastContainer toasts={toasts} onClose={removeToast}/>
          <Footer isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
