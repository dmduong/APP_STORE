export const Url = "http://localhost:8000";
export const version = 'api/v1';

export const header = (tokenUser, refreshToken) => {
  return {
    "Access-Control-Allow-Origin": Url,
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS",
    Accept: "*/*",
    "Access-Control-Max-Age": "1800",
    "Access-Control-Allow-Headers":
      "x-requested-with,content-type, authorization,cookie",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenUser}`,
    Cookies: refreshToken ? `refreshToken=${refreshToken}` : "",
  };
};

export const domain = {
  url_login: `${Url}/${version}/login`,
  url_logout: `${Url}/${version}/me/logout`,
  url_logout_all: `${Url}/${version}/me/logoutAll`,
  url_info_user: `${Url}/${version}/me/informations`,
  url_get_status: (page, limit) =>
    `${Url}/${version}/inventory/status/getAll/${page}/${limit}`,
  url_create_status: `${Url}/${version}/inventory/status/store`,
  url_edit_status: (id) => `${Url}/${version}/inventory/status/${id}`,
  url_update_status: (id) => `${Url}/${version}/inventory/status/update/${id}`,
  url_delete_status: (id) => `${Url}/${version}/inventory/status/delete/${id}`,
  url_get_category: (page, limit) =>
    `${Url}/${version}/inventory/category/getAll/${page}/${limit}`,
  url_all_status: `${Url}/${version}/inventory/status/all`,
  url_create_category: `${Url}/${version}/inventory/category/store`,
  url_delete_category: (id) => `${Url}/${version}/inventory//category/delete/${id}`,
  url_edit_category: (id) => `${Url}/${version}/inventory/category/${id}`,
  url_update_category: (id) => `${Url}/${version}/inventory/category/update/${id}`,
  url_get_unit: (page, limit) =>
  `${Url}/${version}/inventory/unit/getAll/${page}/${limit}`,
  url_create_unit: `${Url}/${version}/inventory/unit/store`,
  url_delete_unit: (id) => `${Url}/${version}/inventory/unit/delete/${id}`,
  url_edit_unit: (id) => `${Url}/${version}/inventory/unit/${id}`,
  url_update_unit: (id) => `${Url}/${version}/inventory/unit/update/${id}`,
  url_get_supplier: (page, limit) =>
  `${Url}/${version}/supplier/getAll/${page}/${limit}`,
  url_create_supplier: `${Url}/${version}/supplier/store`,
  url_delete_supplier: (id) => `${Url}/${version}/supplier/delete/${id}`,
};
