import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Feed from "@/components/Feed";
import Contact from "@/components/Contact";
import { ProjectViewerProvider } from "@/components/ProjectViewer";

export default function Home() {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <SmoothScroll>
        <ProjectViewerProvider>
          <main id="top">
            <Feed />
            <Contact />
          </main>
        </ProjectViewerProvider>
      </SmoothScroll>
    </>
  );
}
