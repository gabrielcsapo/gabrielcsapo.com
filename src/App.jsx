import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@components/ThemeProvider";
import Layout from "./Layout";
import Index from "./pages/index";
import NotFound from "./pages/*.jsx";
function ScrollToLocation() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToLocation />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
