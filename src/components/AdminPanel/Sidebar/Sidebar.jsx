import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";

import './Sidebar.css'

export default function Sidebar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logoutAdmin = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'آیا از خروج از حساب کاربری خود مطمئن هستید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',  
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر',
    }).then((result) => {
      if (result.isConfirmed) {
        authContext.logout();
        navigate('/');
      }
    });
  }

  const menuItems = [
    {
      title: 'صفحه اصلی',
      icon: 'fas fa-home',
      path: '/p-admin'
    },
    {
      title: 'دوره ها',
      icon: "fas fa-book",
      path: "/p-admin/courses",
    },
    {
      title: 'جلسات',
      icon: "fas fa-video",
      path: "/p-admin/sessions",
    },
    {
      title: "منو ها",
      icon: "fas fa-bars",
      path: "/p-admin/menus",
    },
    {
      title: "مقاله ها",
      icon: "fas fa-newspaper",
      path: "/p-admin/articles",
    },
    {
      title: "کاربران",
      icon: "fas fa-users",
      path: "/p-admin/users",
    },
    {
      title: "کامنت ها",
      icon: "fas fa-comment",
      path: "/p-admin/comments",
    },
    
    {
      title: "کدهای تخفیف",
      icon: "fas fa-percent",
      path: "/p-admin/offs",
    },
    {
      title: "دسته‌بندی‌ها",
      icon: "fas fa-tags",
      path: "/p-admin/category",
    },
    {
      title: "تماس با ما",
      icon: "fas fa-phone",
      path: "/p-admin/contact",
    },
    {
      title: "خروج",
      icon: "fas fa-sign-out-alt",
      onClick: logoutAdmin,
    },
  ];

  return (
    <div id="sidebar" className="col-2">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Link to="/p-admin">
            <img src="/images/logo/Logo.png" alt="Logo" />
          </Link>
        </div>

        <div className="sidebar-menu-btn">
          <i className="fas fa-bars"></i>
        </div>
      </div>
      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.path || item.title} 
              className={location.pathname === item.path ? 'active-menu' : ''}
            >
              {item.onClick ? (
                <Link to="#" onClick={item.onClick}>
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Link to={item.path}>
                  <i className={item.icon}></i>
                  <span className="me-4">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}