import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { showToast } from "../../component/toast/Toast";
import { api } from "../../config/axios";
import { act_setPagination, act_setProduct } from "../../redux/action";
import "./Product.css";

const arr = {
  codeProduct: "",
  nameProduct: "",
  amountProduct: "",
  detailProduct: "",
  priceProduct: "",
  priceSellProduct: "",
  weightProduct: "",
  category: "",
  unit: "",
  status: "",
  imageProducts: "",
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const navigate = useNavigate();
  const pagination = useSelector((state) => state.pagination);

  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const fnc_get_product = async (token, pagi) => {
    const response = await api.axios_get_product(token, pagi);
    if (response.status === 200) {
      dispatch(act_setProduct(response.data));
      dispatch(act_setPagination(response.pagination));
    }
  };

  const [text, setText] = useState(arr);
  const [file, setFile] = useState([]);
  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);
  const [status, setStatus] = useState([]);

  const get_status = async (token) => {
    const res = await api.axios_all_status(token);
    if (res.status == 200) {
      const dataNew = [...res.data];
      setStatus(dataNew);
    } else {
      setStatus([]);
    }
  };

  const get_category = async (token, page = { page: "a", limit: "a" }) => {
    const res = await api.axios_get_category(token, page);
    if (res.status == 200) {
      const dataNew = [...res.data];
      setCategory(dataNew);
    } else {
      setCategory([]);
    }
  };

  const get_unit = async (token, page = { page: "a", limit: "a" }) => {
    const res = await api.axios_get_unit(token, page);
    if (res.status == 200) {
      const dataNew = [...res.data];
      setUnit(dataNew);
    } else {
      setUnit([]);
    }
  };

  useEffect(() => {
    get_status(userToken);
    get_category(userToken);
    get_unit(userToken);
  }, []);

  const handleChangeText = (e) => {
    e.preventDefault();
    var target = e.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const valueNew = { ...text };

    if (e.target.files && e.target.files[0]) {
      let fileChange = [...e.target.files];
      let newImageShow = [];
      fileChange.map((images, index) => {
        newImageShow.push(URL.createObjectURL(images));
      });
      setFile(newImageShow);
    }

    setText({
      ...valueNew,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(text);
    const { imageProducts, ...valueSend } = text;
    const formData = new FormData(e.target);
    formData.append("imageProducts", e.target.files);
    console.log(e.target.files);
    const response = await api.axios_create_product(userToken, formData);
    console.log(response);
    return;
    if (response) {
      if (response.status === 200) {
        await fnc_get_product(userToken, pagination);
        setText(arr);
        setFile([]);
        showToast("__SUCCESS_TYPE", response.messages);
        navigate("/product");
      } else if (response.status === 400) {
        showToast("__ERROR_TYPE", response.messages);
      } else {
        showToast("__ERROR_TYPE", response.messages);
      }
    } else {
      showToast("__ERROR_TYPE", response.messages);
    }
  };

  return (
    <>
      <div className="container">
        <div className="mt-1 mb-1 p-2 border border-success rounded d-flex justify-content-between align-items-center">
          <div className="mt-1 mb-2">
            <h5 className="text-success text-center mb-0">Add product</h5>
          </div>
          <div>
            <Link to="/product">
              <Button className="btn btn-secondary">Back</Button>
            </Link>{" "}
          </div>
        </div>
        <div className="pt-2">
          {" "}
          <Form
            onSubmit={handleSubmit}
            method="POST"
            encType="multipart/form-data"
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formBasicCode">
                  <Form.Label>
                    Code <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="codeProduct"
                    value={text.codeProduct}
                    onChange={handleChangeText}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>
                    Name <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nameProduct"
                    onChange={handleChangeText}
                    value={text.nameProduct}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAmount">
                  <Form.Label>
                    Amount <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amountProduct"
                    onChange={handleChangeText}
                    value={text.amountProduct}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDetail">
                  <Form.Label>
                    Detail <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    name="detailProduct"
                    onChange={handleChangeText}
                    value={text.detailProduct}
                    as="textarea"
                    rows={3}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPrice">
                  <Form.Label>
                    Price <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="priceProduct"
                    onChange={handleChangeText}
                    value={text.priceProduct}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group required className="mb-3" controlId="formBasicSell">
                  <Form.Label>
                    Sell <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="priceSellProduct"
                    onChange={handleChangeText}
                    value={text.priceSellProduct}
                  />
                </Form.Group>
                <Form.Group
                  required
                  className="mb-3"
                  controlId="formBasicWeight"
                >
                  <Form.Label>
                    Weight <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="weightProduct"
                    onChange={handleChangeText}
                    value={text.weightProduct}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Status <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="status"
                    onChange={handleChangeText}
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
                <Form.Group className="mb-3">
                  <Form.Label>
                    Category <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="category"
                    onChange={handleChangeText}
                    value={text.category}
                  >
                    <option value="">Open this select menu</option>
                    {category.map((value, index) => (
                      <option key={index} value={value._id}>
                        {value.nameCategory}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Unit <span className="text-danger">( * )</span>
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="unit"
                    onChange={handleChangeText}
                    value={text.unit}
                  >
                    <option value="">Open this select menu</option>
                    {unit.map((value, index) => (
                      <option key={index} value={value._id}>
                        {value.nameUnit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Images</Form.Label>
                  {/* <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    // className="d-none"
                    name="imageProducts"
                    value={text.imageProducts}
                    onChange={handleChangeText}
                  /> */}
                  <input
                    type="file"
                    name="imageProducts"
                    multiple
                    value={text.imageProducts}
                    onChange={handleChangeText}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add one
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
