import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@components/ThemeProvider";
import Layout from "./Layout";
import Index from "./pages/index";
import NotFound from "./pages/*.jsx";

// Nothing links to the posts, so they stay out of the homepage's download.
const Posts = lazy(() => import("./pages/posts/index"));
const Post = lazy(() => import("./pages/posts/Post"));

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
          <Suspense>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/:slug" element={<Post />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
