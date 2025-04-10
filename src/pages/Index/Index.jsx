import AboutUs from "../../components/AboutUs/AboutUs";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LastArticles from "../../components/LastArticles/LastArticles";
import LastCourses from "../../components/LastCourses/LastCourses";
import PopularCourses from "../../components/PopularCourses/PopularCourses";
import PresellCourses from "../../components/PresellCourses/PresellCourses";
import "./Index.css";
export default function Index() {
  return (
    <>
      <Header />
      <LastCourses />
      <AboutUs />
      <PopularCourses />
      <PresellCourses />
      <LastArticles />
      <Footer/>
    </>
  );
}
