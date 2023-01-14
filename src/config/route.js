export const Url = "http://localhost:8000";

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
  url_login: `${Url}/api/v1/login`,
  url_logout: `${Url}/api/v1/me/logout`,
  url_logout_all: `${Url}/api/v1/me/logoutAll`,
  url_info_user: `${Url}/api/v1/me/informations`,
  url_get_status: (page, limit) =>
    `${Url}/api/v1/inventory/status/getAll/${page}/${limit}`,
  url_create_status: `${Url}/api/v1/inventory/status/store`,
  url_edit_status: (id) => `${Url}/api/v1/inventory/status/${id}`,
  url_update_status: (id) => `${Url}/api/v1/inventory/status/update/${id}`,
  url_delete_status: (id) => `${Url}/api/v1/inventory/status/delete/${id}`,
  url_get_category: (page, limit) =>
    `${Url}/api/v1/inventory/category/getAll/${page}/${limit}`,
  url_all_status: `${Url}/api/v1/inventory/status/all`,
  url_create_category: `${Url}/api/v1/inventory/category/store`,
  url_delete_category: (id) => `${Url}/api/v1/inventory//category/delete/${id}`,
  url_edit_category: (id) => `${Url}/api/v1/inventory/category/${id}`,
  url_update_category: (id) => `${Url}/api/v1/inventory/category/update/${id}`,
};
