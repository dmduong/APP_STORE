import React, { useState, useEffect } from "react";
import "./Category.css";
import { api } from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, act_setPagination } from "../../redux/action";
import { showToast } from "../../component/toast/Toast";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Checkbox from "../../component/checkbox/Checkbox";
import { timeToString } from "../../config/utill";
import { FiEdit } from "react-icons/fi";
import { Pagination } from "../../component/pagination/Pagination";
import Modal from "react-bootstrap/Modal";
import { showConfirm } from "../../component/confirm/Confirm";
import { useNavigate } from "react-router-dom";
import { useCookies, removeCookie } from "react-cookie";

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

  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const [list, setList] = useState([]);
  const [status, setStatus] = useState([]);
  const pagination = useSelector((state) => state.pagination);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
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
    dispatch(showLoading(true));
    const res = await api.axios_get_category(token, pagination);
    if (res.status == 200) {
      setList(res.data);
      dispatch(act_setPagination(res.pagination));
    } else {
      setList([]);
      dispatch(act_setPagination(res.pagination));
    }
    dispatch(showLoading(false));
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

  useEffect(
    () => {
      getCategory(userToken, pagination);
      get_status(userToken);
    },
    [dispatch],
    [list],
    [pagination],
    [lgShow]
  );

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handelOpenModal = () => {
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
    dispatch(
      act_setPagination({ ...pagination, page: pagi.page, limit: pagi.limit })
    );
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
      setIsCheck([]);
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

  return (
    <>
      <div className="p-1 col-md-12">
        <div className="mt-1 mb-1 p-2 border border-success rounded d-flex justify-content-between align-items-center">
          <div className="mt-1 mb-2">
            <h5 className="text-success text-center mb-0">Category manager</h5>
          </div>
          <div>
            <Button onClick={() => handelOpenModal()} variant="primary">
              Create
            </Button>{" "}
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>{" "}
          </div>
        </div>

        <div className="mt-1 mb-1 border border-secondary rounded">
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="text-center" width={header.width}>
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length <= 0 ? (
                <tr>
                  <td colSpan={headers.length} align="center">
                    {/* <Spinners></Spinners> */}Data does not exist
                  </td>
                </tr>
              ) : (
                list.map((value, index) => (
                  <tr key={value._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-uppercase">{value.codeCategory}</td>
                    <td className="">{value.nameCategory}</td>
                    <td className="">{value.detailCategory}</td>
                    <td className="text-success text-center">
                      {value.status.nameStatus}
                    </td>
                    <td>{timeToString(value.createdAt)}</td>
                    <td>{timeToString(value.updatedAt)}</td>
                    <td className="text-center">
                      <FiEdit
                        className="icon-edit"
                        onClick={() => handleEdit(value._id)}
                      ></FiEdit>
                    </td>
                    <td className="d-flex justify-content-center align-items-center">
                      <Checkbox
                        key={value._id}
                        type="checkbox"
                        name={"category_" + value._id}
                        id={value._id}
                        handleClick={handleClick}
                        isChecked={isCheck.includes(value._id)}
                        label={""}
                      ></Checkbox>
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={headers.length - 1} align="center">
                  Select all items
                </td>
                <td className="d-flex justify-content-center align-items-center">
                  <Checkbox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                    label={""}
                  ></Checkbox>
                </td>
              </tr>
              <tr>
                <td colSpan={headers.length}>
                  <Pagination
                    data={list}
                    url={"/category"}
                    pagination={pagination}
                    changePage={handleChangePage}
                  ></Pagination>
                </td>
              </tr>
            </tbody>
          </Table>
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
