import React, { useEffect, useState } from "react";
import DataTable from "../../../Components/AdminPanel/DataTable/DataTable";
import Swal from "sweetalert2";
import Input from "./../../../Components/Form/Input";
import { useForm } from "./../../../hooks/useForm";
import {
  requiredValidator,
  minValidator,
  maxValidator,
  emailValidator,
} from "./../../../validators/rules";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formState, onInputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      username: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  const showError = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "متوجه شدم",
      customClass: {
        title: "swal-title",
        content: "swal-text",
        confirmButton: "swal-confirm-button",
      },
    });
  };

  async function getAllUsers() {
    setIsLoading(true);
    setError(null);

    try {
      const localStorageData = JSON.parse(localStorage.getItem("user"));

      if (!localStorageData?.token) {
        throw new Error("توکن معتبر یافت نشد");
      }

      const response = await fetch(`http://localhost:4000/v1/users`, {
        headers: {
          Authorization: `Bearer ${localStorageData.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("دسترسی شما منقضی شده است");
        }
        throw new Error("خطا در دریافت اطلاعات کاربران");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
      showError("خطا", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const removeUser = async (userID) => {
    try {
      const localStorageData = JSON.parse(localStorage.getItem("user"));

      if (!localStorageData?.token) {
        throw new Error("توکن معتبر یافت نشد");
      }

      const result = await Swal.fire({
        title: "آیا از حذف مطمئنی؟",
        text: "این عملیات غیرقابل برگشت است!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله، حذف شود",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        background: "#fff",
        customClass: {
          title: "swal-title",
          content: "swal-text",
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        padding: "3em",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:4000/v1/users/${userID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorageData.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در حذف کاربر");
        }

        await Swal.fire({
          title: "با موفقیت حذف شد!",
          text: "کاربر مورد نظر با موفقیت حذف گردید",
          icon: "success",
          confirmButtonText: "باشه",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            title: "swal-title",
            content: "swal-text",
            confirmButton: "swal-confirm-button",
          },
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });

        console.log(userID);
        getAllUsers();
        
      }
    } catch (error) {
      showError("خطا در حذف کاربر", error.message);
    }
  };

  const banUser = async (userID) => {
    try {
      const localStorageData = JSON.parse(localStorage.getItem("user"));

      if (!localStorageData?.token) {
        throw new Error("توکن معتبر یافت نشد");
      }

      const result = await Swal.fire({
        title: "آیا از بن کاربر مطمئنی؟",
        text: "این عملیات غیرقابل برگشت است!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله، بن شود",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        background: "#fff",
        customClass: {
          title: "swal-title",
          content: "swal-text",
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        borderRadius: "20px",
        padding: "3em",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:4000/v1/users/ban/${userID}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorageData.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در بن کردن کاربر");
        }

        await Swal.fire({
          title: "با موفقیت بن شد!",
          text: "کاربر مورد نظر با موفقیت بن گردید",
          icon: "success",
          confirmButtonText: "باشه",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            title: "swal-title",
            content: "swal-text",
            confirmButton: "swal-confirm-button",
          },
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });

        getAllUsers();
      }
    } catch (error) {
      showError("خطا در بن کردن کاربر", error.message);
    }
  };

  const registerNewUser = async (event) => {
    event.preventDefault();

    try {
      if (!formState.isFormValid) {
        throw new Error("لطفاً تمام فیلدها را به درستی پر کنید");
      }

      const newUserInfo = {
        name: formState.inputs.name.value,
        username: formState.inputs.username.value,
        email: formState.inputs.email.value,
        phone: formState.inputs.phone.value,
        password: formState.inputs.password.value,
        confirmPassword: formState.inputs.password.value,
      };

      const response = await fetch("http://localhost:4000/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در ثبت کاربر جدید");
      }

      await Swal.fire({
        title: "موفقیت",
        text: "کاربر جدید با موفقیت ثبت شد",
        icon: "success",
        confirmButtonText: "باشه",
      });

      getAllUsers();
    } catch (error) {
      showError("خطا در ثبت کاربر", error.message);
    }
  };

  return (
    <>
      {isLoading && <div className="loading">در حال بارگذاری...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="home-content-edit">
        <div className="back-btn">
          <i className="fas fa-arrow-right"></i>
        </div>
        <form className="form">
          <div className="col-6">
            <div className="name input">
              <label className="input-title">نام و نام خانوادگی</label>
              <Input
                type="text"
                className=""
                id="name"
                element="input"
                validations={[
                  requiredValidator(),
                  minValidator(8),
                  maxValidator(20),
                ]}
                onInputHandler={onInputHandler}
                placeholder="لطفا نام و نام خانوادگی کاربر را وارد کنید..."
              />
              <span className="error-message text-danger"></span>
            </div>
          </div>
          <div className="col-6">
            <div className="family input">
              <label className="input-title">نام کاربری</label>
              <Input
                type="text"
                className=""
                id="username"
                element="input"
                validations={[
                  requiredValidator(),
                  minValidator(8),
                  maxValidator(20),
                ]}
                onInputHandler={onInputHandler}
                placeholder="لطفا نام کاربری را وارد کنید..."
              />
              <span className="error-message text-danger"></span>
            </div>
          </div>
          <div className="col-6">
            <div className="email input">
              <label className="input-title">ایمیل</label>
              <Input
                type="text"
                className=""
                id="email"
                element="input"
                validations={[
                  requiredValidator(),
                  minValidator(8),
                  maxValidator(20),
                  emailValidator(),
                ]}
                onInputHandler={onInputHandler}
                placeholder="لطفا ایمیل کاربر را وارد کنید..."
              />
              <span className="error-message text-danger"></span>
            </div>
          </div>
          <div className="col-6">
            <div className="password input">
              <label className="input-title">رمز عبور</label>
              <Input
                type="text"
                className=""
                id="password"
                element="input"
                validations={[
                  requiredValidator(),
                  minValidator(8),
                  maxValidator(20),
                ]}
                onInputHandler={onInputHandler}
                placeholder="لطفا رمز عبور کاربر را وارد کنید..."
              />
              <span className="error-message text-danger"></span>
            </div>
          </div>
          <div className="col-6">
            <div className="phone input">
              <label className="input-title">شماره تلفن</label>
              <Input
                type="text"
                className=""
                id="phone"
                element="input"
                validations={[
                  requiredValidator(),
                  minValidator(8),
                  maxValidator(20),
                ]}
                onInputHandler={onInputHandler}
                placeholder="لطفا شماره تلفن کاربر را وارد کنید..."
              />
              <span className="error-message text-danger"></span>
            </div>
          </div>
          <div className="col-12">
            <div className="bottom-form">
              <div className="submit-btn">
                <input type="submit" value="افزودن" onClick={registerNewUser} />
              </div>
            </div>
          </div>
        </form>
      </div>
      <DataTable title="کاربران">
        {users.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>نام و نام خانوادگی</th>
                <th>ایمیل</th>
                <th>ویرایش</th>
                <th>حذف</th>
                <th>بن</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button type="button" className="btn btn-primary edit-btn">
                      ویرایش
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger delete-btn"
                      onClick={() => removeUser(user._id)}
                    >
                      حذف
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger delete-btn"
                      onClick={() => banUser(user._id)}
                    >
                      بن
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">هیچ کاربری یافت نشد</div>
        )}
      </DataTable>
    </>
  );
}
