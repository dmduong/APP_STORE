import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getItem, setItem } from "../../config/utill";
import { act_activeMenu } from "../../redux/action";
import "./Menu.css";

const Menu = () => {
  const dispatch = useDispatch();
  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });
  const handleClickMenu = (id) => {
    const list = [...listMenu];
    list.map((value, index) => {
      if (value._id === id) {
        list[index].active = true;
      } else {
        list[index].active = false;
      }
    });
    setItem("listMenu", list);
    dispatch(act_activeMenu(list));
  };

  return (
    <div>
      {listMenu.map((value, index) => (
        <Link
          key={index}
          onClick={() => handleClickMenu(value._id)}
          className="list-link"
          to={value.link}
        >
          {value.name}
          <div className={value.active ? "node-active" : ""}></div>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
