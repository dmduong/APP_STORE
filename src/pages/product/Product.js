import React, { useEffect, useState } from "react";
import "./Product.css";
import { Button, Image, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, Outlet, useSearchParams } from "react-router-dom";
import Checkbox from "../../component/checkbox/Checkbox";
import { Pagination } from "../../component/pagination/Pagination";
import { api } from "../../config/axios";
import { formatCash, setTitle, timeToString } from "../../config/utill";
import { act_setPagination, act_setProduct } from "../../redux/action";
import { Url } from "../../config/route";
import Spinners from "../../component/spinner/Spinners";
import Placeholders from "../../component/placeholders/Placeholders";
import ListNormal from "../../component/List/ListNormal";
const Product = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page_url_params = searchParams.get("page");
  const limit_url_params = searchParams.get("limit");
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([[], []]);
  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
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

  const fnc_get_product = async (token, pagi) => {
    const response = await api.axios_get_product(token, pagi);
    if (response.status === 200) {
      const dataNew = [...response.data];
      setList(dataNew);
      setPagination(response.pagination);
    } else {
      const dataNew = [[], []];
      setList(dataNew);
    }

    setLoading(false);
  };

  useEffect(() => {
    setTitle(props.user.storeId.nameStore, props.title);
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

  return (
    <>
      <div className="p-1 col-md-12">
        <div className="mt-1 mb-1 p-2 border d-flex justify-content-between align-items-center">
          <div className="mt-1 mb-2">
            <h5 className="text-center mb-0">Quản lý {props.title}</h5>
          </div>
          <div>
            <Link to="/product/add">
              <Button variant="primary">Create</Button>
            </Link>{" "}
            {/* <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>{" "} */}
          </div>
        </div>

        <div className="mt-1 mb-1 border">
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
              name={"product"}
              data={list}
              pagination={pagination}
              changePages={handleChangePage}
              hide_column={new Array("_id", "storeId", "imageProduct")}
              id_column={new Array("_id")}
              // onClickDetail={handleClickDetail}
              // onClickEdit={handleEdit}
              customColumn={{
                select_column: true,
                edit_column: true,
                image_column: "imageProduct",
                stt_column: true,
                // detail_column: [
                //   {
                //     type: "link",
                //   },
                // ],
                // displayArray: new Array("imageProduct"),
              }}
            ></ListNormal>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
