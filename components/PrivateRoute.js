import { AuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useContext } from "react";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  if (!user) {
    router.push("/login");
  }

  return <>{children}</>;
};

export default PrivateRoute;
