import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="overflow-hidden font-sans bg-white selection:bg-primary-lighter">
      <Nav />
      <main className="flex flex-col justify-center px-8">
        <div className="flex flex-col items-start justify-start w-full max-w-2xl min-h-screen mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
