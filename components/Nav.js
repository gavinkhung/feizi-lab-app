import { AuthContext } from "@/lib/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
const Nav = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div
        className={
          "flex flex-row justify-between items-center max-w-4xl w-full p-8 my-0 md:my-8 mx-auto print:hidden"
        }
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-wide text-black uppercase md:text-xl lg:text-2xl"
        >
          Gavin Hung Application
        </Link>

        <ul className="flex flex-row flex-wrap list-none">
          <NavItem route="home" />

          {user ? (
            <>
              <NavItem route="upload" />
              <NavItem route="label" />
            </>
          ) : (
            <NavItem route="login" />
          )}
        </ul>
      </div>
    </>
  );
};
export default Nav;

const NavItem = ({ route }) => {
  const router = useRouter();
  return (
    <li>
      <Link
        href={route === "home" ? "/" : `/${route}`}
        className={`cursor-pointer px-1 md:px-2 text-base md:text-lg lg:text-xl font-medium text-gray-900 capitalize border-b-4 border-transparent hover:text-gray-500 transition ${
          ((router.pathname === "/" && route === "home") ||
            router.pathname === "/" + route) &&
          "border-blue-500"
        }`}
      >
        {route}
      </Link>
    </li>
  );
};
