import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useMemo } from "react";

/** Hook to track the previous route */
const usePreviousUrl = () => {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location]);

  return prevPathRef.current;
};

/** Memoized user role fetcher */
const useUserRole = () => {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.roleId;
    } catch (err) {
      return null;
    }
  }, []);
};

/** Protected route wrapper */
const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = useUserRole();
  const previousUrl = usePreviousUrl();
  const fallbackUrl = previousUrl || "/";

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (!requiredRole.includes(userRole)) {
    return <Navigate to={fallbackUrl} replace />;
  }

  return children;
};

export default ProtectedRoute;
