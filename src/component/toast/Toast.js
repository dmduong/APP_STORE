import React from "react";
import { toast } from "react-toastify";
import GetHTML from "./GetHTML";

export const showToast = (
  type = "__SUCCESS_TYPE",
  title = "success",
  position = "__TOP_RIGHT"
) => {
  let position_toast = "";
  switch (position) {
    case "__TOP_RIGHT":
      position_toast = "top-right";
      break;

    default:
      position_toast = "top-right";
      break;
  }

  let title_toast = "";
  if (typeof title == "string") {
    title_toast = title;
  } else {
    title_toast = () => <GetHTML title={title}></GetHTML>;
  }

  switch (type) {
    case "__SUCCESS_TYPE":
      toast.success(title_toast, {
        position: position_toast,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "__ERROR_TYPE":
      toast.error(title_toast, {
        position: position_toast,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "__WARNING_TYPE":
      toast.warn(title_toast, {
        position: position_toast,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    case "__INFOR_TYPE":
      toast.info(title_toast, {
        position: position_toast,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    default:
      toast.success(title_toast, {
        position: position_toast,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
  }
};
