import Layout from "@/components/Layout";
import AuthProvider from "@/lib/AuthProvider";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
