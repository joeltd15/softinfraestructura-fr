import { Navigate } from "react-router-dom"
import { checkPermission } from "../authUtils"

const ProtectedComponent = ({ children, permission }) => {
  if (!checkPermission(permission)) {
    return <Navigate to="/404" replace />
  }

  return children
}

export default ProtectedComponent