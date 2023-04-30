import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/axios";
import {
  act_setIsCheck,
  act_setIsCheckAll,
  act_setPagination,
  act_setSupplier,
  showLoading,
} from "../../redux/action";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { setTitle, timeToString } from "../../config/utill";
import Modal from "react-bootstrap/Modal";
import { showToast } from "../../component/toast/Toast";
import { showConfirm } from "../../component/confirm/Confirm";
import Placeholders from "../../component/placeholders/Placeholders";
import ListNormal from "../../component/List/ListNormal";

const Supplier = (props) => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const isCheck = useSelector((state) => state.objectsValue.isCheck);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const pagination = useSelector((state) => state.pagination);
  const [status, setStatus] = useState([]);
  const [lgShow, setLgShow] = useState(false);
  const [lgShowEdit, setLgShowEdit] = useState(false);
  const [readOnly, setReadOnly] = useState({
    idSupplier: false,
    codeSupplier: false,
    nameSupplier: false,
    phoneSupplier: false,
    addressSupplier: false,
    createdAt: false,
    updatedAt: false,
    storeName: false,
    statusId: false,
  });
  const [text, setText] = useState({
    codeSupplier: "",
    nameSupplier: "",
    phoneSupplier: "",
    addressSupplier: "",
    statusId: "",
  });

  const [textEdit, setTextEdit] = useState({
    idSupplier: "",
    codeSupplier: "",
    nameSupplier: "",
    phoneSupplier: "",
    addressSupplier: "",
    statusId: "",
    createdAt: "",
    updatedAt: "",
    storeName: "",
  });

  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const list = useSelector((state) => state.listSupplier);

  const fnc_get_supplier = async (token, pagi) => {
    const response = await api.axios_get_supplier(token, pagi);
    if (response.status === 200) {
      const dataNew = [...response.data.data];
      dispatch(act_setSupplier(dataNew));
      dispatch(act_setPagination(response.data.pagination));
    }
    setLoading(false);
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
    fnc_get_supplier(userToken, pagination);
    get_status(userToken);
    setTitle(props.user.storeId.nameStore, props.title);
  }, []);

  const handleChangePage = (pagi) => {
    fnc_get_supplier(userToken, {
      ...pagination,
      page: pagi.page,
      limit: pagi.limit,
    });
  };

  const handelOpenModal = () => {
    setReadOnly({
      ...readOnly,
      codeSupplier: false,
      nameSupplier: false,
      addressSupplier: false,
      phoneSupplier: false,
      statusId: false,
    });
    setText({
      ...text,
      nameSupplier: "",
      codeSupplier: "",
      addressSupplier: "",
      phoneSupplier: "",
      statusId: "",
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
    const res = await api.axios_create_supplier(userToken, data);
    dispatch(showLoading(false));
    if (res.status === 200) {
      setLgShow(false);
      await fnc_get_supplier(userToken, pagination);
      showToast("__SUCCESS_TYPE", res.messages);
    } else if (res.status === 400) {
      showToast("__ERROR_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
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
    let res = await api.axios_delete_supplier(token, id);
    if (res.status == 200) {
      await fnc_get_supplier(token, pagination);
      dispatch(act_setIsCheck([]));
      dispatch(act_setIsCheckAll(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
    dispatch(showLoading(false));
  };

  const edit_supplier = async (token, id) => {
    const res = await api.axios_edit_supplier(token, id);
    if (res.status == 200) {
      const dataNew = { ...res.data };
      setTextEdit({
        ...textEdit,
        idSupplier: dataNew._id,
        codeSupplier: dataNew.codeSupplier,
        nameSupplier: dataNew.nameSupplier,
        phoneSupplier: dataNew.phoneSupplier,
        addressSupplier: dataNew.addressSupplier,
        statusId: dataNew.statusId ? dataNew.statusId._id : 0,
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
    await edit_supplier(userToken, id);
    setReadOnly({
      ...readOnly,
      createdAt: true,
      updatedAt: true,
      storeName: true,
      codeSupplier: true,
      nameSupplier: false,
      phoneSupplier: false,
      addressSupplier: false,
      statusId: false,
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
    let { nameSupplier, phoneSupplier, statusId, idSupplier, addressSupplier } =
      textEdit;
    let res = await api.axios_update_supplier(userToken, idSupplier, {
      nameSupplier,
      phoneSupplier,
      addressSupplier,
      statusId,
    });

    if (res.status == 200) {
      setLgShowEdit(false);
      await fnc_get_supplier(userToken, pagination);
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
              hide_column={new Array("_id", "storeId")}
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
              Create supplier
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="scroll-bar" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Supplier code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeSupplier}
                  name="codeSupplier"
                  value={text.codeSupplier}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Supplier name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameSupplier}
                  name="nameSupplier"
                  value={text.nameSupplier}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Supplier phone (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="number"
                  readOnly={readOnly.phoneSupplier}
                  name="phoneSupplier"
                  value={text.phoneSupplier}
                  onChange={handleChangeText}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address category</Form.Label>
                <Form.Control
                  readOnly={readOnly.addressSupplier}
                  name="addressSupplier"
                  value={text.addressSupplier}
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
                  readOnly={readOnly.statusId}
                  onChange={handleChangeText}
                  aria-label="Default select example"
                  name="statusId"
                  value={text.statusId}
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
              Edit supplier
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
                  Supplier code (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="tetx"
                  readOnly={readOnly.codeSupplier}
                  name="codeSupplier"
                  value={textEdit.codeSupplier}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Supplier name (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.nameSupplier}
                  name="nameSupplier"
                  value={textEdit.nameSupplier}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  Supplier phone (<span className="text-danger"> * </span>)
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly={readOnly.phoneSupplier}
                  name="phoneSupplier"
                  value={textEdit.phoneSupplier}
                  onChange={handleChangeTextEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address supplier</Form.Label>
                <Form.Control
                  readOnly={readOnly.addressSupplier}
                  name="addressSupplier"
                  value={textEdit.addressSupplier}
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
                  readOnly={readOnly.statusId}
                  onChange={handleChangeTextEdit}
                  aria-label="Default select example"
                  name="statusId"
                  value={textEdit.statusId}
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

export default Supplier;
