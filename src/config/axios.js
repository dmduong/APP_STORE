import axios from "axios";
import { showToast } from "../component/toast/Toast";
import { header } from "./route";
import { domain } from "./route";

// [Login]
const axios_login = async (dataForm) => {
  return await axios
    .post(domain.url_login, dataForm)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[logout]
const axios_logout = async (token, refreshToken) => {
  return await axios
    .post(
      domain.url_logout,
      {},
      {
        headers: header(token, refreshToken),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[logout]
const axios_logout_all = async (token, refreshToken) => {
  return await axios
    .post(
      domain.url_logout_all,
      {},
      {
        headers: header(token, refreshToken),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get_user]
const axios_infor_user = async (token) => {
  return await axios
    .get(domain.url_info_user, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get_status]
const axios_get_status = async (token, pagination) => {
  let page = pagination.page;
  let limit = pagination.limit;

  return await axios
    .get(domain.url_get_status(page, limit), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_status]
const axios_create_status = async (token, data) => {
  return await axios
    .post(domain.url_create_status, data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_status]
const axios_edit_status = async (token, id) => {
  return await axios
    .get(domain.url_edit_status(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[update_status]
const axios_update_status = async (token, id, data) => {
  return await axios
    .put(domain.url_update_status(id), data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      showToast("__ERROR_TYPE", error.message);
    });
};

//[delete_status]
const axios_delete_status = async (token, id) => {
  return await axios
    .delete(domain.url_delete_status(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get all category]
const axios_get_category = async (token, pagination) => {
  let page = pagination.page;
  let limit = pagination.limit;

  return await axios
    .get(domain.url_get_category(page, limit), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get all category]
const axios_all_status = async (token) => {
  return await axios
    .get(domain.url_all_status, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_create_category = async (token, data) => {
  return await axios
    .post(domain.url_create_category, data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[delete_status]
const axios_delete_category = async (token, id) => {
  return await axios
    .delete(domain.url_delete_category(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_edit_category = async (token, id) => {
  return await axios
    .get(domain.url_edit_category(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[update_status]
const axios_update_category = async (token, id, data) => {
  return await axios
    .put(domain.url_update_category(id), data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get all category]
const axios_get_unit = async (token, pagination) => {
  let page = pagination.page;
  let limit = pagination.limit;

  return await axios
    .get(domain.url_get_unit(page, limit), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_create_unit = async (token, data) => {
  return await axios
    .post(domain.url_create_unit, data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[delete_status]
const axios_delete_unit = async (token, id) => {
  return await axios
    .delete(domain.url_delete_unit(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_edit_unit = async (token, id) => {
  return await axios
    .get(domain.url_edit_unit(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[update_status]
const axios_update_unit = async (token, id, data) => {
  return await axios
    .put(domain.url_update_unit(id), data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      showToast("__ERROR_TYPE", error.message);
    });
};

//[get all category]
const axios_get_supplier = async (token, pagination) => {
  let page = pagination.page;
  let limit = pagination.limit;

  return await axios
    .get(domain.url_get_supplier(page, limit), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_create_supplier = async (token, data) => {
  return await axios
    .post(domain.url_create_supplier, data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[delete_status]
const axios_delete_supplier = async (token, id) => {
  return await axios
    .delete(domain.url_delete_supplier(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[create_category]
const axios_edit_supplier = async (token, id) => {
  return await axios
    .get(domain.url_edit_supplier(id), {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showToast("__ERROR_TYPE", error.message);
    });
};

//[update_status]
const axios_update_supplier = async (token, id, data) => {
  return await axios
    .put(domain.url_update_supplier(id), data, {
      headers: header(token),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      showToast("__ERROR_TYPE", error.message);
    });
};

export const api = {
  axios_login: axios_login,
  axios_logout: axios_logout,
  axios_logout_all: axios_logout_all,
  axios_infor_user: axios_infor_user,
  axios_get_status: axios_get_status,
  axios_create_status: axios_create_status,
  axios_edit_status: axios_edit_status,
  axios_update_status: axios_update_status,
  axios_delete_status: axios_delete_status,
  axios_get_category: axios_get_category,
  axios_all_status: axios_all_status,
  axios_create_category: axios_create_category,
  axios_delete_category: axios_delete_category,
  axios_edit_category: axios_edit_category,
  axios_update_category: axios_update_category,
  axios_get_unit: axios_get_unit,
  axios_create_unit: axios_create_unit,
  axios_delete_unit: axios_delete_unit,
  axios_edit_unit: axios_edit_unit,
  axios_update_unit: axios_update_unit,
  axios_get_supplier: axios_get_supplier,
  axios_create_supplier: axios_create_supplier,
  axios_delete_supplier: axios_delete_supplier,
  axios_edit_supplier: axios_edit_supplier,
  axios_update_supplier: axios_update_supplier,
};
