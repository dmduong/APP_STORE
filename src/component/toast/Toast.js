import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  __ERROR_TYPE,
  __SUCCESS_TYPE,
  __TOP_RIGHT,
  __WARNING_TYPE,
  __INFOR_TYPE,
} from "../../config/content";

export const showToast = (
  type = "__SUCCESS_TYPE" || __SUCCESS_TYPE,
  title = "success",
  position = "__TOP_RIGHT" || __TOP_RIGHT,
  close = 5000
) => {
  let position_toast = "";
  switch (position) {
    case "__TOP_RIGHT" || __TOP_RIGHT:
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
    // title_toast = () => <GetHTML title={title}></GetHTML>;
    let title_s = "";
    title.map((value, index) => {
      title_s += "<i style='text-align: start;'> + " + value.msg + "</i>";
    });
    Swal.fire({
      title: "<i style='color: DarkOrange;'>Warning !</i>",
      html:
        '<div style="display: flex;flex-direction: column; justify-content: start;">' +
        title_s +
        "</div>",
      showCloseButton: true,
      showConfirmButton: false,
    });
    return;
  }

  switch (type) {
    case "__SUCCESS_TYPE" || __SUCCESS_TYPE:
      toast.success(title_toast, {
        position: position_toast,
        autoClose: close,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "__ERROR_TYPE" || __ERROR_TYPE:
      toast.error(title_toast, {
        position: position_toast,
        autoClose: close,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    case "__WARNING_TYPE" || __WARNING_TYPE:
      toast.warn(title_toast, {
        position: position_toast,
        autoClose: close,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    case "__INFOR_TYPE" || __INFOR_TYPE:
      toast.info(title_toast, {
        position: position_toast,
        autoClose: close,
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
        autoClose: close,
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
