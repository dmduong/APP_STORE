import React, { useState, useEffect } from "react";
import "./Category.css";
import { api } from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  showLoading,
  act_setPagination,
  act_setIsCheck,
  act_setIsCheckAll,
} from "../../redux/action";
import { showToast } from "../../component/toast/Toast";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Checkbox from "../../component/checkbox/Checkbox";
import { setTitle, timeToString } from "../../config/utill";
import { FiEdit } from "react-icons/fi";
import { Pagination } from "../../component/pagination/Pagination";
import Modal from "react-bootstrap/Modal";
import { showConfirm } from "../../component/confirm/Confirm";
import { useNavigate } from "react-router-dom";
import { useCookies, removeCookie } from "react-cookie";
import Placeholders from "../../component/placeholders/Placeholders";
import ListNormal from "../../component/List/ListNormal";

const headers = [
  {
    with: "2px",
    name: "Stt",
  },
  {
    with: "2px",
    name: "Category code",
  },
  {
    with: "",
    name: "Name category",
  },
  {
    with: "",
    name: "Detail category",
  },
  {
    with: "",
    name: "Status",
  },
  {
    with: "",
    name: "Create time",
  },
  {
    name: "Update time",
    with: "",
  },
  {
    name: "Edit",
    with: "2px",
  },
  {
    name: "Select",
    with: "2px",
  },
];

const Category = (props) => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const isCheck = useSelector((state) => state.objectsValue.isCheck);
  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const [list, setList] = useState([[], []]);
  const [status, setStatus] = useState([]);
  const pagination = useSelector((state) => state.pagination);
  const [isLoading, setIsLoading] = useState(true);
  const [lgShow, setLgShow] = useState(false);
  const [lgShowEdit, setLgShowEdit] = useState(false);
  const [readOnly, setReadOnly] = useState({
    idCategory: false,
    codeCategory: false,
    nameCategory: false,
    detailCategory: false,
    createdAt: false,
    updatedAt: false,
    storeName: false,
    status: false,
  });
  const [text, setText] = useState({
    codeCategory: "",
    nameCategory: "",
    detailCategory: "",
    status: "",
  });

  const [textEdit, setTextEdit] = useState({
    idCategory: "",
    codeCategory: "",
    nameCategory: "",
    detailCategory: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    storeName: "",
  });

  const getCategory = async (token, pagination) => {
    const res = await api.axios_get_category(token, pagination);
    if (res.status == 200) {
      setList(res.data);
      dispatch(act_setPagination(res.pagination));
    } else {
      setList([[], []]);
      dispatch(act_setPagination(res.pagination));
    }
    setIsLoading(false);
  };

  const get_status = async (token) => {
    const res = await api.axios_all_status(token);
    if (res.status == 200) {
      const dataNew = [...res.data];
      setStatus(dataNew);
    } else {
      setStatus([]);
    }
  };

  useEffect(() => {
    getCategory(userToken, pagination);
    setTitle(props.user.storeId.nameStore, props.title);
  }, [dispatch]);

  const handelOpenModal = async () => {
    await get_status(userToken);
    setReadOnly({
      ...readOnly,
      codeCategory: false,
      nameCategory: false,
      detailCategory: false,
      status: false,
    });
    setText({
      ...text,
      nameCategory: "",
      codeCategory: "",
      detailCategory: "",
      status: "",
    });
    setLgShow(true);
  };

  const handleChangeText = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;
    setText({
      ...text,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    dispatch(showLoading(true));
    e.preventDefault();
    let data = { ...text };
    const res = await api.axios_create_category(userToken, data);
    dispatch(showLoading(false));
    if (res.status == 200) {
      setLgShow(false);
      await getCategory(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status == 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleChangePage = (pagi) => {
    getCategory(userToken, {
      ...pagination,
      page: pagi.page,
      limit: pagi.limit,
    });
  };

  const handleDelete = () => {
    if (isCheck.length <= 0 || isCheck.length >= 2) {
      showToast("__WARNING_TYPE", "Please, select one item !");
    } else {
      showConfirm("Warning", "Are you sure delete ?", deleteItems, [
        userToken,
        isCheck[0],
      ]);
    }
  };

  const deleteItems = async (data) => {
    const id = data[1];
    const token = data[0];
    dispatch(showLoading(true));
    let res = await api.axios_delete_category(token, id);
    if (res.status == 200) {
      await getCategory(token, pagination);
      dispatch(act_setIsCheck([]));
      dispatch(act_setIsCheckAll(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
    dispatch(showLoading(false));
  };

  const edit_category = async (token, id) => {
    const res = await api.axios_edit_category(token, id);
    if (res.status == 200) {
      const dataNew = { ...res.data };
      setTextEdit({
        ...textEdit,
        idCategory: dataNew._id,
        codeCategory: dataNew.codeCategory,
        nameCategory: dataNew.nameCategory,
        detailCategory: dataNew.detailCategory,
        status: dataNew.status,
        createdAt: timeToString(dataNew.createdAt),
        updatedAt: timeToString(dataNew.updatedAt),
        storeName:
          dataNew.storeId.codeStore + " - " + dataNew.storeId.nameStore,
      });
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleEdit = async (id) => {
    dispatch(showLoading(true));
    await edit_category(userToken, id);
    setReadOnly({
      ...readOnly,
      createdAt: true,
      updatedAt: true,
      storeName: true,
      codeCategory: true,
      nameCategory: false,
      detailCategory: false,
      status: false,
    });
    setLgShowEdit(true);
    dispatch(showLoading(false));
  };

  const handleChangeTextEdit = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;
    setTextEdit({
      ...textEdit,
      [name]: value,
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    dispatch(showLoading(true));
    let { nameCategory, detailCategory, status, idCategory } = textEdit;
    let res = await api.axios_update_category(userToken, idCategory, {
      nameCategory,
      detailCategory,
      status,
    });

    if (res.status == 200) {
      setLgShowEdit(false);
      await getCategory(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status == 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }

    dispatch(showLoading(false));
  };

  const handleClickDetail = () => {};

  return (
    <>
      <div className="p-1 col-md-12">
        <div className="mt-1 mb-1 p-2 border rounded d-flex justify-content-between align-items-center">
          <div className="mt-1 mb-2">
            <h5 className="text-center mb-0">Quản lý {props.title}</h5>
          </div>
          <div>
            <Button onClick={() => handelOpenModal()} variant="primary">
              Thêm mới
            </Button>{" "}
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>{" "}
          </div>
        </div>

        <div className="mt-1 mb-1 border rounded">
          {isLoading ? (
            <Placeholders
              type={"table"}
              numberCols={7}
              numberRows={7}
              styleCustom={{
                background: "rgb(224, 224, 224)",
                color: "rgb(224, 224, 224)",
              }}
            ></Placeholders>
          ) : (
            <ListNormal
              name={"category"}
              data={list}
              pagination={pagination}
              changePages={handleChangePage}
              hide_column={new Array("_id", "nameStore")}
              id_column={new Array("_id")}
              onClickDetail={handleClickDetail}
              onClickEdit={handleEdit}
              customColumn={{
                select_column: true,
                edit_column: true,
                stt_column: true,
                detail_column: false,
              }}
            ></ListNormal>
          )}
        </div>
      </div>

      <>
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Create category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="scroll-bar" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Category code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeCategory}
                  name="codeCategory"
                  value={text.codeCategory}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Category name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameCategory}
                  name="nameCategory"
                  value={text.nameCategory}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Detail category</Form.Label>
                <Form.Control
                  readOnly={readOnly.detailCategory}
                  name="detailCategory"
                  value={text.detailCategory}
                  as="textarea"
                  onChange={handleChangeText}
                  rows={3}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Status (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Select
                  readOnly={readOnly.status}
                  onChange={handleChangeText}
                  aria-label="Default select example"
                  name="status"
                  value={text.status}
                >
                  <option value="">Open this select menu</option>
                  {status.map((value, index) => (
                    <option key={index} value={value._id}>
                      {value.nameStatus}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" className="float-right" type="submit">
                  Create
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>

      <>
        <Modal
          size="lg"
          show={lgShowEdit}
          onHide={() => setLgShowEdit(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Edit category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="scroll-bar" onSubmit={handleSubmitEdit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Store</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.storeName}
                  name="storeName"
                  value={textEdit.storeName}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Category code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeCategory}
                  name="codeCategory"
                  value={textEdit.codeCategory}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Category name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameCategory}
                  name="nameCategory"
                  value={textEdit.nameCategory}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Detail category</Form.Label>
                <Form.Control
                  readOnly={readOnly.detailCategory}
                  name="detailCategory"
                  value={textEdit.detailCategory}
                  as="textarea"
                  onChange={handleChangeTextEdit}
                  rows={3}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Status (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Select
                  readOnly={readOnly.status}
                  onChange={handleChangeTextEdit}
                  aria-label="Default select example"
                  name="status"
                  value={textEdit.status}
                >
                  <option value="">Open this select menu</option>
                  {status.map((value, index) => (
                    <option key={index} value={value._id}>
                      {value.nameStatus}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Create time</Form.Label>
                <Form.Control
                  type="dateTime"
                  readOnly={readOnly.createdAt}
                  name="createdAt"
                  value={textEdit.createdAt}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Update time</Form.Label>
                <Form.Control
                  type="dateTime"
                  readOnly={readOnly.updatedAt}
                  name="updatedAt"
                  value={textEdit.updatedAt}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" className="float-right" type="submit">
                  Create
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
};

export default Category;
