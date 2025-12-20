import { Navigate } from "react-router-dom";
import { auth } from "../../Firebase";

const PrivateRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
