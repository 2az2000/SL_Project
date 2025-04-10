import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "./../../Components/Topbar/Topbar";
import Navbar from "./../../Components/Navbar/Navbar";
import Footer from "./../../Components/Footer/Footer";
import SectionHeader from "../../Components/SectionHeader/SectionHeader";
import CourseBox from "../../Components/CourseBox/CourseBox";
import ArticleBox from "../../Components/ArticleBox/ArticleBox";

export default function Search() {
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const { value } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/v1/search/${value}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCourses(data.allResultCourses)
        setArticles(data.allResultArticles)
      });
  }, []);
  return (
    <>
      <Topbar />
      <Navbar />

      <div className="courses">
        <div className="container">
          <SectionHeader
            title="نتیجه جستجوی دوره‌ها"
            desc="سکوی پرتاپ شما به سمت موفقیت"
          />
          {courses.length === 0 ? (
            <div className="alert alert danger">
              دوره‌ای برای جستجوی مدنظر شما وجود ندارد
            </div>
          ) : (
            <>
              {courses.map((course) => (
                <CourseBox {...course} />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="courses">
        <div className="container">
          <SectionHeader
            title="نتیجه جستجوی مقالات"
            desc="پیش به سوی ارتقای دانش"
          />
          {articles.length === 0 ? (
            <div className="alert alert danger">
              دوره‌ای برای جستجوی مدنظر شما وجود ندارد
            </div>
          ) : (
            <>
              {articles.map((article) => (
                <ArticleBox {...article} />
              ))}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
