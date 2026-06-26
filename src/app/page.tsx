import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Feed from "@/components/Feed";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <SmoothScroll>
        <main id="top">
          <Feed />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
