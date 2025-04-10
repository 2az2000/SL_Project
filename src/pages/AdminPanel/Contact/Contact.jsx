import React, { useEffect, useState } from "react";
import swal from "sweetalert2";
import DataTable from "../../../Components/AdminPanel/DataTable/DataTable";
import "./sweetalert.css";

export default function Contact() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getAllContacts();
  }, []);

  function getAllContacts() {
    fetch("http://localhost:4000/v1/contact")
      .then((res) => res.json())
      .then((allContacts) => {
        console.log(allContacts);
        setContacts(allContacts);
      });
  }

  const showContactBody = (body) => {
    swal.fire({
      title: body,
      confirmButtonText: "تایید",
      // cancelButtonText: "انصراف",
      // showCancelButton: true,

      // استایل‌های سفارشی
      customClass: {
        popup: "swal2-persian-font",
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-button-custom",
        // cancelButton: "swal2-cancel-button-custom",
      },

      // تنظیمات ظاهری
      width: "auto",
      padding: "2em",
      background: "#fff",
      backdrop: `rgba(0,0,123,0.4)`,
      position: "center",

      // انیمیشن
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },

      // آیکون و رنگ‌بندی
      icon: "info",
      iconColor: "#3498db",

      // تنظیمات دکمه‌ها
      buttonsStyling: true,
      reverseButtons: true,
    });
  };
  const sendAnwserToUser = (contactEmail) => {
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    swal
      .fire({
        title: "متن پاسخ را وارد کنید",
        input: "textarea",
        inputPlaceholder: "پاسخ خود را اینجا بنویسید...",
        inputAttributes: {
          "aria-label": "پاسخ خود را اینجا بنویسید",
          dir: "rtl",
        },
        confirmButtonText: "ارسال پاسخ",
        cancelButtonText: "انصراف",
        showCancelButton: true,

        // استایل‌های سفارشی
        customClass: {
          popup: "swal2-persian-font",
          title: "swal2-title-custom",
          input: "swal2-input-custom",
          confirmButton: "swal2-confirm-button-custom",
          cancelButton: "swal2-cancel-button-custom",
          validationMessage: "swal2-validation-custom",
        },

        // تنظیمات ظاهری
        width: "500px",
        padding: "2em",
        background: "#fff",
        backdrop: `rgba(0,0,123,0.4)`,
        position: "center",

        // انیمیشن
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },

        // آیکون و رنگ‌بندی
        icon: "question",
        iconColor: "#3498db",

        // تنظیمات دکمه‌ها
        buttonsStyling: true,
        reverseButtons: true,

        // اعتبارسنجی
        inputValidator: (value) => {
          if (!value) {
            return "لطفاً متن پاسخ را وارد کنید";
          }
          if (value.length < 10) {
            return "پاسخ باید حداقل ۱۰ کاراکتر باشد";
          }
        },

        // پیش‌نمایش قبل از ارسال
        preConfirm: (value) => {
          return value.trim();
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          const response = result.value;
          console.log(response);

          const anwserInfo = {
            email: contactEmail,
            answer: response,
          };

          fetch("http://localhost:4000/v1/contact/answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorageData.token}`,
            },
            body: JSON.stringify(anwserInfo),
          })
            .then((res) => {
              console.log(res);
              if (res.ok) {
                return res.json();
              }
            })
            .then((result) => console.log(result));
        }
      });
  };

  return (
    <>
      <DataTable title="پیغام‌ها">
        <table className="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام و نام خانوادگی</th>
              <th>ایمیل</th>
              <th>شماره تماس</th>
              <th>مشاهده</th>
              <th>پاسخ</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr>
                <td
                  className={
                    contact.answer === 1
                      ? "answer-contact"
                      : "no-answer-contact"
                  }
                >
                  {index + 1}
                </td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary edit-btn"
                    onClick={() => showContactBody(contact.body)}
                  >
                    مشاهده پیغام
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary edit-btn"
                    onClick={() => sendAnwserToUser(contact.email)}
                  >
                    پاسخ
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger delete-btn"
                    onClick={() => removeContact(contact._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
