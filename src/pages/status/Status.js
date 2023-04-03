import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Status.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Checkbox from "../../component/checkbox/Checkbox";
import { api } from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../component/toast/Toast";
import { timeToString } from "../../config/utill";
import Modal from "react-bootstrap/Modal";
import { FiEdit } from "react-icons/fi";
import {
  act_setIsCheck,
  act_setIsCheckAll,
  showLoading,
} from "../../redux/action";
import Spinners from "../../component/spinner/Spinners";
import { showConfirm } from "../../component/confirm/Confirm";
import { Pagination } from "../../component/pagination/Pagination";
import { useCookies, removeCookie } from "react-cookie";
import {
  Link,
  useNavigate,
  createSearchParams,
  useSearchParams,
  Outlet,
} from "react-router-dom";
import ListNormal from "../../component/List/ListNormal";
import Placeholders from "../../component/placeholders/Placeholders";
import ButtonCustom from "../../component/button/Button";
import InputCustom from "../../component/input/InputCustom";

const Status = (props) => {
  const isCheck = useSelector((state) => state.objectsValue.isCheck);
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const user = useSelector((state) => {
    if (cookies.user != "") {
      return cookies.user;
    } else {
      return state.user;
    }
  });

  const refreshToken = useSelector((state) => {
    if (cookies.refreshToken != "") {
      return cookies.refreshToken;
    } else {
      return state.refreshToken;
    }
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const page_url_params = searchParams.get("page");
  const limit_url_params = searchParams.get("limit");
  const dispatch = useDispatch();
  const [list, setList] = useState([[], []]);
  const [loading, setLoading] = useState(true);
  const [lgShow, setLgShow] = useState(false);
  const [lgShowEdit, setLgShowEdit] = useState(false);
  const [text, setText] = useState({
    codeStatus: "",
    nameStatus: "",
  });

  const [pagination, setPagination] = useState(() => {
    if (!page_url_params) {
      return {
        page: 0,
        limit: 5,
        pages: 0,
        total: 0,
      };
    } else {
      return {
        page: page_url_params - 1,
        limit: limit_url_params,
        pages: 0,
        total: 0,
      };
    }
  });

  const [textEdit, setTextEdit] = useState({
    idStatus: "",
    codeStatus: "",
    nameStatus: "",
    createdAt: "",
    updatedAt: "",
    storeName: "",
  });

  const [readOnly, setReadOnly] = useState({
    idStatus: false,
    codeStatus: false,
    nameStatus: false,
    createdAt: false,
    updatedAt: false,
    storeName: false,
  });

  const get_status = async (token, pagination) => {
    const res = await api.axios_get_status(token, pagination);
    console.log(res);
    if (res.status == 200) {
      const dataNew = [...res.data];

      setPagination(res.pagination);
      setList(dataNew);
    } else {
      const dataNew = [[], []];
      setList(dataNew);
      // showToast("__ERROR_TYPE", res.messages);
    }
    setLoading(false);
  };

  const edit_status = async (token, id) => {
    const res = await api.axios_edit_status(token, id);
    if (res.status == 200) {
      const dataNew = { ...res.data };
      setTextEdit({
        ...textEdit,
        idStatus: dataNew._id,
        codeStatus: dataNew.codeStatus,
        nameStatus: dataNew.nameStatus,
        createdAt: timeToString(dataNew.createdAt),
        updatedAt: timeToString(dataNew.updatedAt),
        storeName:
          dataNew.storeId.codeStore + " - " + dataNew.storeId.nameStore,
      });
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  useEffect(() => {
    get_status(userToken, pagination);
  }, [dispatch]);

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
    const res = await api.axios_create_status(userToken, data);
    dispatch(showLoading(false));
    if (res.status == 200) {
      setLgShow(false);
      await get_status(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status == 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleEdit = async (id) => {
    dispatch(showLoading(true));
    await edit_status(userToken, id);
    setReadOnly({
      ...readOnly,
      codeStatus: true,
      createdAt: true,
      updatedAt: true,
      storeName: true,
    });
    setLgShowEdit(true);
    dispatch(showLoading(false));
  };

  const handelOpenModal = () => {
    setReadOnly({
      ...readOnly,
      codeStatus: false,
      nameStatus: false,
    });
    setText({ ...text, nameStatus: "", codeStatus: "" });
    setLgShow(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    dispatch(showLoading(true));
    let { nameStatus, idStatus } = textEdit;
    let res = await api.axios_update_status(userToken, idStatus, {
      nameStatus,
    });

    if (res.status == 200) {
      setLgShowEdit(false);
      await get_status(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status == 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }

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

  const handleDelete = () => {
    if (isCheck.length <= 0 || isCheck.length >= 2) {
      showToast("__WARNING_TYPE", "Please, select one item !");
    } else {
      showConfirm("Xác nhận !", "Are you sure delete it ?", deleteItems, [
        userToken,
        isCheck[0],
      ]);
    }
  };

  const deleteItems = async (data) => {
    const id = data[1];
    const token = data[0];
    dispatch(showLoading(true));
    let res = await api.axios_delete_status(token, id);
    if (res.status == 200) {
      await get_status(token, pagination);
      dispatch(act_setIsCheck([]));
      dispatch(act_setIsCheckAll(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
    dispatch(showLoading(false));
  };

  const handleChangePage = (pagi) => {
    get_status(userToken, {
      ...pagination,
      page: pagi.page,
      limit: pagi.limit,
    });
  };

  const onClick = (action) => {
    alert(action);
  };

  const handleClickDetail = (id) => {
    console.log(id);
  };

  return (
    <div className="p-1 col-md-12">
      <Outlet></Outlet>
      <div className="mt-1 mb-1 p-2 border rounded d-flex justify-content-between align-items-center">
        <div className="mt-1 mb-2">
          <h5 className="text-dark text-center mb-0">Status manager</h5>
        </div>
        <div>
          <ButtonCustom
            title={"Create"}
            size={""}
            color={"primary"}
            onClick={() => handelOpenModal()}
          ></ButtonCustom>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>{" "}
        </div>
      </div>

      <div className="mt-1 mb-1 border rounded">
        {loading ? (
          <Placeholders
            type={"table"}
            numberCols={6}
            numberRows={6}
            styleCustom={{
              background: "rgb(224, 224, 224)",
              color: "rgb(224, 224, 224)",
            }}
          ></Placeholders>
        ) : (
          <ListNormal
            name={"status"}
            data={list}
            pagination={pagination}
            changePages={handleChangePage}
            hide_column={new Array("_id")}
            id_column={new Array("_id")}
            onClickDetail={handleClickDetail}
            customColumn={{
              select_column: true,
              edit_column: true,
              stt_column: true,
              detail_column: [
                {
                  type: "link",
                  link: "",
                },
              ],
            }}
            onClickEdit={handleEdit}
          ></ListNormal>
        )}
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
              Create status
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <InputCustom
                type={"text"}
                readOnly={readOnly.codeStatus}
                name={"codeStatus"}
                id={"codeStatus"}
                value={text.codeStatus}
                onChange={handleChangeText}
                required={true}
                label={"Mã trạng thái"}
                styleInput={{ width: "100%" }}
              />

              <InputCustom
                type={"text"}
                name={"nameStatus"}
                value={text.nameStatus}
                onChange={handleChangeText}
                readOnly={readOnly.nameStatus}
                label={"Tên trạng thái"}
                required={true}
                id={"nameStatus"}
              ></InputCustom>

              {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Status name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameStatus}
                  name="nameStatus"
                  value={text.nameStatus}
                  onChange={handleChangeText}
                />
              </Form.Group> */}
              <div className="d-flex justify-content-end">
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
              Update status
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitEdit}>
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
                <Form.Label>Status code</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.codeStatus}
                  name="codeStatus"
                  value={textEdit.codeStatus.toUpperCase()}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Status name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameStatus}
                  name="nameStatus"
                  value={textEdit.nameStatus}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Create time</Form.Label>
                <Form.Control
                  type="dateTime"
                  readOnly={readOnly.createdAt}
                  name="createdAt"
                  value={textEdit.createdAt}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Update time</Form.Label>
                <Form.Control
                  type="dateTime"
                  readOnly={readOnly.updatedAt}
                  name="updatedAt"
                  value={textEdit.updatedAt}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="primary" className="float-right" type="submit">
                  Update
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
};

Status.propTypes = {};

export default Status;
