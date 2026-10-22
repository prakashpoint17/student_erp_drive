import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DriveSpaceProvider } from "./context/DriveSpaceContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { HodDashboard } from "./pages/hod/HodDashboard";
import { StaffDashboard } from "./pages/staff/StaffDashboard";
import { StudentPortal } from "./pages/student/StudentPortal";
import { ConnectSpaceModal } from "./components/modals/ConnectSpaceModal";
import { ScriptGuideModal } from "./components/modals/ScriptGuideModal";

function DashboardContainer() {
  const { currentUser } = useAuth();
  
  // Navigation tabs and modal states
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  // Set default tab based on user role
  useEffect(() => {
    if (currentUser?.role === "admin" || currentUser?.role === "hod") {
      setActiveTab("overview");
    } else {
      setActiveTab("profile");
    }
  }, [currentUser?.role, currentUser?.uid]);

  // Strictly render only this user's authorized role dashboard
  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "admin":
        return (
          <AdminDashboard 
            activeTab={activeTab} 
            onOpenConnectModal={() => setConnectModalOpen(true)}
            onOpenScriptGuide={() => setScriptModalOpen(true)}
          />
        );
      case "hod":
        return (
          <HodDashboard 
            activeTab={activeTab} 
            onOpenConnectModal={() => setConnectModalOpen(true)}
            onOpenScriptGuide={() => setScriptModalOpen(true)}
          />
        );
      case "staff":
        return <StaffDashboard activeTab={activeTab} />;
      case "student":
        return <StudentPortal activeTab={activeTab} />;
      default:
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <h3 className="text-lg font-bold text-brand-red-700">Role Not Authorized</h3>
            <p className="text-xs text-slate-500 mt-1">Please contact the Administrator to verify your account permissions.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenScriptGuide={() => setScriptModalOpen(true)}
        onOpenConnectModal={() => setConnectModalOpen(true)}
      />

      <div className="flex flex-1 w-full min-h-[calc(100vh-109px)]">
        {/* Responsive Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full bg-[#f4f7fb]">
          {renderDashboard()}
        </main>
      </div>

      {/* Global Modals */}
      <ConnectSpaceModal 
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      <ScriptGuideModal 
        isOpen={scriptModalOpen}
        onClose={() => setScriptModalOpen(false)}
      />
    </div>
  );
}

// Router component separating the unauthenticated LoginPage from the authenticated Dashboard
function MainAppRouter() {
  const { currentUser } = useAuth();

  // If no user is logged in, show the Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  // If user is logged in, wrap in DriveSpaceProvider and mount Dashboard
  return (
    <DriveSpaceProvider>
      <DashboardContainer />
    </DriveSpaceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppRouter />
    </AuthProvider>
  );
}
