import React, { useEffect, useState } from "react";
import DataTable from "../../../Components/AdminPanel/DataTable/DataTable";
import swal from "sweetalert";
import { useForm } from "./../../../hooks/useForm";
import Input from "./../../../Components/Form/Input";
import {
  requiredValidator,
  minValidator,
  maxValidator,
} from "./../../../validators/rules";

import "./Courses.css";

export default function Courses() {
  // تعریف state های کامپوننت
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [courseCategory, setCourseCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [courseStatus, setCourseStatus] = useState("start");
  const [courseCover, setCourseCover] = useState({});

  const [formState, onInputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      shortName: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      support: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    getAllCourses();

    fetch(`http://localhost:4000/v1/category`)
      .then((res) => res.json())
      .then((allCategories) => {
        setCategories(allCategories);
      });
  }, []);

  /**
   * @function getAllCourses
   * @async
   * @description دریافت لیست دوره‌ها از API
   * @throws {Error} در صورت عدم وجود توکن یا خطا در دریافت داده‌ها
   */

  const getAllCourses = async () => {
    try {
      // دریافت اطلاعات کاربر از localStorage
      const localStorageData = JSON.parse(localStorage.getItem("user"));

      // بررسی وجود توکن معتبر
      if (!localStorageData || !localStorageData.token) {
        throw new Error("توکن معتبر یافت نشد");
      }

      // درخواست به API
      const response = await fetch("http://localhost:4000/v1/courses", {
        headers: {
          Authorization: `Bearer ${localStorageData.token}`,
        },
      });

      // بررسی وضعیت پاسخ
      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات دوره‌ها");
      }

      const allCourses = await response.json();
      // اطمینان از آرایه بودن داده‌های دریافتی
      if (Array.isArray(allCourses)) {
        setCourses(allCourses);
      } else {
        throw new Error("فرمت داده‌های دریافتی نامعتبر است");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
    }
    getAllCourses();
  };

  /**
   * @function formatPrice
   * @description فرمت‌بندی قیمت دوره
   * @param {number} price - قیمت دوره
   * @returns {string} قیمت فرمت‌بندی شده
   */
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "نامشخص";
    return price === 0 ? "رایگان" : price.toLocaleString();
  };

  /**
   * @function getStatus
   * @description تعیین وضعیت دوره
   * @param {number} isComplete - وضعیت تکمیل دوره
   * @returns {string} وضعیت دوره به صورت متنی
   */
  const getStatus = (isComplete) => {
    if (isComplete === null || isComplete === undefined) return "نامشخص";
    return isComplete === 0 ? "در حال برگزاری" : "تکمیل شده";
  };

  /**
   * @function safeRender
   * @description نمایش امن مقادیر در جدول
   * @param {*} value - مقدار ورودی
   * @returns {string} مقدار قابل نمایش
   */
  const safeRender = (value) => {
    if (value === null || value === undefined) return "نامشخص";
    if (typeof value === "object") return JSON.stringify(value);
    if (value === "6345cbd132c10de974957632") return "برنامه نویسی فرانت اند";
    if (value === "6345cc0a32c10de974957635") return "برنامه نویسی بک اند";
    return String(value);
  };

  const removeCourse = (courseID) => {
    swal({
      title: "آیا از حذف دوره مورد نظر مطمئن هستید؟",
      icon: "warning",
      buttons: ["انصراف", "حذف"],
    }).then((result) => {
      if (result) {
        fetch(`http://localhost:4000/v1/courses/${courseID}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorageData.token}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 200) {
              swal({
                title: "دوره مورد نظر با موفقیت حذف شد",
                icon: "success",
                buttons: "اوکی",
              }).then(() => getAllCourses());
            } else {
              swal({
                title: "خطا در حذف دوره",
                icon: "error",
                buttons: "اوکی",
              });
            }
          });
      }
    });
  };
  const selectCategory = (event) => {
    setCourseCategory(event.target.value);
  };

  const addNewCourse = (event) => {
    event.preventDefault();
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    let formData = new FormData();
    formData.append("name", formState.inputs.name.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("shortName", formState.inputs.shortName.value);
    formData.append("categoryID", courseCategory);
    formData.append("price", formState.inputs.price.value);
    formData.append("support", formState.inputs.support.value);
    formData.append("status", courseStatus);
    formData.append("cover", courseCover);

    if (courseCategory === "-1") {
      swal({
        title: "لطفا دسته بندی دوره را انتخاب کنید",
        icon: "error",
      });
    } else {
      fetch(`http://localhost:4000/v1/courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorageData.token}`,
        },
        body: formData,
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          swal({
            title: "دوره جدید با موفقیت اضافه شد",
            icon: "success",
            buttons: "اوکی",
          }).then(() => {
            getAllCourses();
          });
        }
      });
    }
  };

  return (
    <>
      <div className="container-fluid" id="home-content">
        <div className="container">
          <div className="home-title">
            <span>افزودن دوره جدید</span>
          </div>
          <form className="form">
            <div className="col-6">
              <div className="name input">
                <label className="input-title">نام دوره</label>
                <Input
                  id="name"
                  element="input"
                  onInputHandler={onInputHandler}
                  validations={[minValidator(5)]}
                  type="text"
                  placeholder="لطفا نام دوره را وارد کنید..."
                />
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="price input">
                <label className="input-title">توضیحات دوره</label>
                <Input
                  id="description"
                  element="input"
                  onInputHandler={onInputHandler}
                  validations={[minValidator(5)]}
                  type="text"
                  placeholder="لطفا توضیحات دوره را وارد کنید..."
                />
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="number input">
                <label className="input-title">Url دوره</label>
                <Input
                  id="shortName"
                  element="input"
                  onInputHandler={onInputHandler}
                  validations={[minValidator(5)]}
                  type="text"
                  isValid="false"
                  placeholder="لطفا Url دوره را وارد کنید..."
                />
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="price input">
                <label className="input-title">قیمت دوره</label>
                <Input
                  id="price"
                  element="input"
                  onInputHandler={onInputHandler}
                  validations={[minValidator(5)]}
                  type="text"
                  isValid="false"
                  placeholder="لطفا قیمت دوره را وارد کنید..."
                />
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="price input">
                <label className="input-title">نحوه پشتیبانی دوره</label>
                <Input
                  id="support"
                  element="input"
                  onInputHandler={onInputHandler}
                  validations={[minValidator(5)]}
                  type="text"
                  isValid="false"
                  placeholder="لطفا نحوه پشتیبانی دوره را وارد کنید..."
                />
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="number input">
                <label className="input-title">دسته‌بندی دوره</label>
                <select onChange={selectCategory}>
                  <option value="-1">لطفا دسته‌بندی را انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category?._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <span className="error-message text-danger"></span>
              </div>
            </div>
            <div className="col-6">
              <div className="file">
                <label className="input-title">عکس دوره</label>
                <input
                  type="file"
                  id="file"
                  onChange={(event) => {
                    console.log(event.target.files[0]);
                    setCourseCover(event.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="bottom-form">
                <div className="condition">
                  <label className="input-title">وضعیت دوره</label>
                  <div className="radios">
                    <div className="available">
                      <label>
                        <span>در حال برگزاری</span>
                        <input
                          type="radio"
                          value="start"
                          name="condition"
                          checked
                          onInput={(event) =>
                            setCourseStatus(event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <div className="unavailable">
                      <label>
                        <span>پیش فروش</span>
                        <input
                          type="radio"
                          value="presell"
                          name="condition"
                          onInput={(event) =>
                            setCourseStatus(event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="submit-btn">
                  <input type="submit" value="افزودن" onClick={addNewCourse} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <DataTable title="دوره‌ها">
        {/* نمایش خطا در صورت وجود */}
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table">
            {/* سرستون‌های جدول */}
            <thead>
              <tr>
                <th>شناسه</th>
                <th>عنوان</th>
                <th>مبلغ</th>
                <th>وضعیت</th>
                <th>لینک</th>
                <th>مدرس</th>
                <th>دسته بندی</th>
                <th>ویرایش</th>
                <th>حذف</th>
              </tr>
            </thead>
            {/* بدنه جدول */}
            <tbody>
              {Array.isArray(courses) &&
                courses.map((course, index) => (
                  <tr key={course?._id || index} className="fs-8">
                    <td>{index + 1}</td>
                    <td>{safeRender(course?.name)}</td>
                    <td>{formatPrice(course?.price)}</td>
                    <td>{getStatus(course?.isComplete)}</td>
                    <td>{safeRender(course?.shortName)}</td>
                    <td>
                      {/* نمایش نام مدرس با در نظر گرفتن ساختار شیء */}
                      {typeof course?.creator === "object"
                        ? course?.creator?.name
                        : safeRender(course?.creator)}
                    </td>
                    <td>
                      {/* نمایش نام دسته‌بندی با در نظر گرفتن ساختار شیء */}
                      {typeof course?.categoryID === "object"
                        ? course?.categoryID?.name
                        : safeRender(course?.categoryID)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary edit-btn"
                      >
                        ویرایش
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger delete-btn"
                        onClick={() => removeCourse(course?._id)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </DataTable>
    </>
  );
}
