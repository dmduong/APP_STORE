import React, { useState, useEffect } from "react";
import "./Pagination.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Select from "../select/Select";

export const Pagination = (props) => {
  const navigate = useNavigate();
  // const [pagination, setPagination] = useState(props.pagination);
  let { page, pages, limit, total, dataOfPage } = props.pagination;
  const { data } = props;
  //get params in url page
  let page_url_params = page;
  let limit_url_params = limit;
  let pageCurent = page + 1;
  let pagesCurent = pages + 1;
  const [active, setActive] = useState(() => {
    if (!page_url_params) {
      return 1;
    }
    return page_url_params;
  });
  let items = [];
  for (let number = 1; number < pagesCurent; number++) {
    items.push(
      <div
        key={number}
        onClick={() => {
          setActive(number);
          props.changePage({
            page: number - 1,
            limit: !limit_url_params ? limit : limit_url_params,
          });
        }}
        className={
          number === Number(active)
            ? "item-pagination active"
            : "item-pagination"
        }
      >
        {number}
      </div>
    );
  }

  const nextPage = (p) => {
    let pageNext = Number(active) + p;
    setActive(Number(active) + p);
    props.changePage({
      page: pageNext - 1,
      limit: !limit_url_params ? limit : limit_url_params,
    });
  };

  const prePage = (pr) => {
    setActive(Number(active) + pr);
    let pagePre = Number(active) + pr;
    props.changePage({
      page: pagePre - 1,
      limit: !limit_url_params ? limit : limit_url_params,
    });
  };

  const handleChange = (limit) => {
    props.changePage({
      page: 0,
      limit: limit,
    });
    setActive(1);
  };

  return (
    <div className="pagination-content">
      <div className="pagination-left">
        <div className="">
          <Select
            name={"cmb_set_limit"}
            id={"cmb_set_limit"}
            data={Array(
              { id: 1, name: 5, value: 5 },
              { id: 2, name: 10, value: 10 },
              { id: 3, name: 20, value: 20 }
            )}
            values={5}
            handleChange={handleChange}
            size={"sm"}
            disabled={false}
          ></Select>
        </div>
        <div className="total-items">-/- {total}</div>
      </div>
      <div className="pagination-right">
        {data.length > 0 ? (
          <>
            <div
              className={
                Number(active) === 1
                  ? "pre-pagination div-disable"
                  : "pre-pagination"
              }
              onClick={() => prePage(-1)}
            >
              <FiChevronLeft className="icon"></FiChevronLeft>
            </div>
            <div className="list-items">
              {items}
              {/* <div className="item-pagination active">1</div>
          <div className="item-pagination">...</div>
          <div className="item-pagination">2</div>
          <div className="item-pagination">3</div>
          <div className="item-pagination">...</div>
          <div className="item-pagination">4</div> */}
            </div>
            <div
              className={
                Number(active) === Number(Math.ceil(total / limit))
                  ? "next-pagination div-disable"
                  : "next-pagination"
              }
              onClick={() => nextPage(1)}
            >
              <FiChevronRight className="icon"></FiChevronRight>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
