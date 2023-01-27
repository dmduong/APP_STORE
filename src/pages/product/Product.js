import React, { useEffect, useState } from "react";
import "./Product.css";
import { Image, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Checkbox from "../../component/checkbox/Checkbox";
import { Pagination } from "../../component/pagination/Pagination";
import { api } from "../../config/axios";
import { formatCash, timeToString } from "../../config/utill";
import { act_setPagination, act_setProduct } from "../../redux/action";
import { Url } from "../../config/route";
import Spinners from "../../component/spinner/Spinners";

const headers = [
  {
    with: "2px",
    name: "Stt",
  },
  {
    with: "2px",
    name: "code",
  },
  {
    with: "",
    name: "Name",
  },
  {
    with: "",
    name: "Amount",
  },
  {
    with: "",
    name: "price",
  },
  {
    with: "",
    name: "Retail price",
  },
  {
    with: "",
    name: "Detail",
  },
  {
    with: "",
    name: "Weight",
  },
  {
    with: "",
    name: "Image",
  },
  {
    with: "",
    name: "Status",
  },
  {
    with: "",
    name: "Category",
  },
  {
    with: "",
    name: "Unit",
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

const Product = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const navigate = useNavigate();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const pagination = useSelector((state) => state.pagination);
  const list = useSelector((state) => state.listProduct);

  const fnc_get_product = async (token, pagi) => {
    const response = await api.axios_get_product(token, pagi);
    if (response.status === 200) {
      dispatch(act_setProduct(response.data));
      dispatch(act_setPagination(response.pagination));
    }
  };

  useEffect(() => {
    fnc_get_product(userToken, pagination);
  }, []);

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

  const handleChangePage = (pagi) => {
    dispatch(
      act_setPagination({ ...pagination, page: pagi.page, limit: pagi.limit })
    );
    fnc_get_product(userToken, {
      ...pagination,
      page: pagi.page,
      limit: pagi.limit,
    });
  };

  console.log(list);
  return (
    <>
      <div className="p-1 col-md-12">
        <div className="mt-1 mb-1 p-2 border border-success rounded d-flex justify-content-between align-items-center">
          <div className="mt-1 mb-2">
            <h5 className="text-success text-center mb-0">Category manager</h5>
          </div>
          <div>
            {/* <Button onClick={() => handelOpenModal()} variant="primary">
              Create
            </Button>{" "}
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>{" "} */}
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
                    <td className="text-uppercase">{value.codeProduct}</td>
                    <td className="">{value.nameProduct}</td>
                    <td className="">
                      {formatCash(value.amountProduct, value.unit.nameUnit)}
                    </td>
                    <td className="">
                      {formatCash(value.priceProduct, "vnđ")}
                    </td>
                    <td className="">
                      {formatCash(value.priceSellProduct, "vnđ")}
                    </td>
                    <td className="">{value.detailProduct}</td>
                    <td className="">{value.weightProduct}</td>
                    <td className="" style={{ width: "auto" }}>
                      <div className="content-image">
                        {value.imageProduct ? (
                          value.imageProduct.map((data, key) => (
                            <div key={key} className="box-image">
                              <Image
                                className="image-item"
                                src={Url + data.nameImage}
                              />
                            </div>
                          ))
                        ) : (
                          <Spinners></Spinners>
                        )}
                      </div>
                    </td>
                    <td className="text-success text-center">
                      {value.status.nameStatus}
                    </td>
                    <td className="text-success text-center">
                      {value.category.nameCategory}
                    </td>
                    <td className="text-success text-center">
                      {value.unit.nameUnit}
                    </td>
                    <td>{timeToString(value.createdAt)}</td>
                    <td>{timeToString(value.updatedAt)}</td>
                    <td className="text-center">
                      <FiEdit
                        className="icon-edit"
                        // onClick={() => handleEdit(value._id)}
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
    </>
  );
};

export default Product;
