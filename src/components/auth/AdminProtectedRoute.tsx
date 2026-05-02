import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="h-12 w-12 rounded-2xl border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Check if user is authenticated and has admin email
  const isAdmin = user && (
    user.email === "admin@hasa.gold" || 
    user.email === "dmcreatorstudio04@gmail.com"
  );

  if (!user || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};
