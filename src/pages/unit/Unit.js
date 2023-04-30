import React, { useEffect, useState } from "react";
import "./Unit.css";
import { api } from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  showLoading,
  act_setUnit,
  act_setPagination,
  act_setIsCheck,
  act_setIsCheckAll,
} from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { useCookies, removeCookie } from "react-cookie";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Checkbox from "../../component/checkbox/Checkbox";
import { setTitle, timeToString } from "../../config/utill";
import { FiEdit } from "react-icons/fi";
import { Pagination } from "../../component/pagination/Pagination";
import Modal from "react-bootstrap/Modal";
import { showToast } from "../../component/toast/Toast";
import { showConfirm } from "../../component/confirm/Confirm";
import Placeholders from "../../component/placeholders/Placeholders";
import ListNormal from "../../component/List/ListNormal";

const headers = [
  {
    with: "2px",
    name: "Stt",
  },
  {
    with: "2px",
    name: "Unit code",
  },
  {
    with: "",
    name: "Name unit",
  },
  {
    with: "",
    name: "Detail unit",
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

const Unit = (props) => {
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const dispatch = useDispatch();
  const isCheck = useSelector((state) => state.objectsValue.isCheck);
  const [isLoading, setIsLoading] = useState(true);
  const pagination = useSelector((state) => state.pagination);
  const [lgShow, setLgShow] = useState(false);
  const [lgShowEdit, setLgShowEdit] = useState(false);
  const list = useSelector((state) => state.listUnit);
  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });
  const [status, setStatus] = useState([]);

  const [readOnly, setReadOnly] = useState({
    idUnit: false,
    codeUnit: false,
    nameUnit: false,
    detailUnit: false,
    createdAt: false,
    updatedAt: false,
    storeName: false,
    status: false,
  });

  const [text, setText] = useState({
    codeUnit: "",
    nameUnit: "",
    detailUnit: "",
    status: "",
  });

  const [textEdit, setTextEdit] = useState({
    idUnit: "",
    codeUnit: "",
    nameUnit: "",
    detailUnit: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    storeName: "",
  });

  const fnc_get_unit = async (token, pagination) => {
    const response = await api.axios_get_unit(token, pagination);
    if (response.status === 200) {
      const data = [...response.data];
      dispatch(act_setUnit(data));
      dispatch(act_setPagination(response.pagination));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fnc_get_unit(userToken, pagination);
    get_status(userToken);
    setTitle(props.user.storeId.nameStore, props.title);
  }, []);

  const handleChangePage = (pagi) => {
    fnc_get_unit(userToken, {
      ...pagination,
      page: pagi.page,
      limit: pagi.limit,
    });
  };

  const handelOpenModal = () => {
    setReadOnly({
      ...readOnly,
      codeUnit: false,
      nameUnit: false,
      detailUnit: false,
      status: false,
    });
    setText({
      ...text,
      nameUnit: "",
      codeUnit: "",
      detailUnit: "",
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
    const res = await api.axios_create_unit(userToken, data);
    dispatch(showLoading(false));
    if (res.status == 200) {
      setLgShow(false);
      await fnc_get_unit(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status == 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
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
    let res = await api.axios_delete_unit(token, id);
    if (res.status == 200) {
      await fnc_get_unit(token, pagination);
      dispatch(act_setIsCheck([]));
      dispatch(act_setIsCheckAll(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
    dispatch(showLoading(false));
  };

  const edit_unit = async (token, id) => {
    const res = await api.axios_edit_unit(token, id);
    if (res.status == 200) {
      const dataNew = { ...res.data };
      setTextEdit({
        ...textEdit,
        idUnit: dataNew._id,
        codeUnit: dataNew.codeUnit,
        nameUnit: dataNew.nameUnit,
        detailUnit: dataNew.detailUnit,
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
    await edit_unit(userToken, id);
    setReadOnly({
      ...readOnly,
      createdAt: true,
      updatedAt: true,
      storeName: true,
      codeUnit: true,
      nameUnit: false,
      detailUnit: false,
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
    let { nameUnit, detailUnit, status, idUnit } = textEdit;
    let res = await api.axios_update_unit(userToken, idUnit, {
      nameUnit,
      detailUnit,
      status,
    });

    if (res.status == 200) {
      setLgShowEdit(false);
      await fnc_get_unit(userToken, pagination);
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
            <h5 className="text-success text-center mb-0">
              Quản lý {props.title}
            </h5>
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
              name={"unit"}
              data={list}
              pagination={pagination}
              changePages={handleChangePage}
              hide_column={new Array("_id", "nameStore")}
              id_column={new Array("_id")}
              // onClickDetail={handleClickDetail}
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
              Create unit
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="scroll-bar" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Unit code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeUnit}
                  name="codeUnit"
                  value={text.codeUnit}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Unit name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameUnit}
                  name="nameUnit"
                  value={text.nameUnit}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Detail unit</Form.Label>
                <Form.Control
                  readOnly={readOnly.detailUnit}
                  name="detailUnit"
                  value={text.detailUnit}
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
              Edit unit
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
                  Unit code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeUnit}
                  name="codeUnit"
                  value={textEdit.codeUnit}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Unit name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameUnit}
                  name="nameUnit"
                  value={textEdit.nameUnit}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Detail unit</Form.Label>
                <Form.Control
                  readOnly={readOnly.detailUnit}
                  name="detailUnit"
                  value={textEdit.detailUnit}
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

export default Unit;
