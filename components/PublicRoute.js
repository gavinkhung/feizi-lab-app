import { AuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useContext } from "react";

const PublicRoute = ({ redirect, children }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  if (user) {
    router.push(redirect);
  }

  return <>{children}</>;
};

export default PublicRoute;
