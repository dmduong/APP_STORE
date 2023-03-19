import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ListNormal.css";
import { Table } from "react-bootstrap";
import { timeToString, uniqueArray } from "../../config/utill";
import Checkbox from "../checkbox/Checkbox";
import { FiEdit } from "react-icons/fi";
import { Pagination } from "../pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  act_setIsCheck,
  act_setIsCheckAll,
  atc_setId,
} from "../../redux/action";
import Spinners from "../spinner/Spinners";
import { propTypes } from "react-bootstrap/esm/Image";
import Placeholders from "../placeholders/Placeholders";

const ListNormal = (props) => {
  const dispatch = useDispatch();
  const isCheck = useSelector((state) => state.objectsValue.isCheck);
  const isCheckAll = useSelector((state) => state.objectsValue.isCheckAll);
  const h_id = useSelector((state) => state.objectsValue.h_id);
  const __span = "~^~";
  let id_cols_custom = new Array();
  let {
    data,
    pagination,
    changePages,
    customColumn,
    name,
    hide_column,
    onClickEdit,
    id_column,
  } = props;
  const hide_cols_custom = (hide_column) => {
    let hide_cols_new = new Array();
    for (let index = 0; index < hide_column.length; index++) {
      const element = hide_column[index];
      hide_cols_new[element] = element;
    }

    return hide_cols_new;
  };
  let hideCols = hide_cols_custom(hide_column);
  const handleChangePage = (pagi) => {
    changePages(pagi);
  };

  const handleEdit = async (id) => {
    onClickEdit(id);
    dispatch(atc_setId(id));
  };

  const handleSelectAll = (e) => {
    dispatch(act_setIsCheckAll(!isCheckAll));
    if (id_column.length > 0) {
      let news = new Array();
      id_cols_custom.map((v, k) => {
        news.push(v.join(__span));
      });
      const arr = uniqueArray(news);
      dispatch(act_setIsCheck(arr.map((li) => li)));
      if (isCheckAll) {
        dispatch(act_setIsCheck([]));
      }
    } else {
      dispatch(act_setIsCheck(data[0].map((li) => li[0][1])));
      if (isCheckAll) {
        dispatch(act_setIsCheck([]));
      }
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    dispatch(act_setIsCheck([...isCheck, id]));
    if (!checked) {
      dispatch(act_setIsCheck(isCheck.filter((item) => item !== id)));
    }
  };

  function check_arr(element, arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === element) {
        count++;
        break;
      }
    }
    return count > 0 ? true : false;
  }

  let element_header = "";
  element_header = "";
  let header = new Array();
  if (!data[1] || data[1].length <= 0) {
  } else {
    header = [...data[1]];
    if (customColumn.stt_column) {
      if (!check_arr("_stt", header)) {
        header.unshift(Array("_stt", "Stt"));
      }
    }

    if (customColumn.select_column && customColumn.edit_column) {
      header = [...header, Array("_edit", "Sửa"), Array("_select", "Chọn")];
    } else if (!customColumn.select_column && customColumn.edit_column) {
      header = [...header, Array("_edit", "Sửa")];
    } else if (customColumn.select_column && !customColumn.edit_column) {
      header = [...header, Array("_select", "Chọn")];
    } else {
      header = [...header];
    }

    element_header = (
      <thead>
        <tr>
          {header.map((data, index) => {
            if (hideCols[data[0]]) {
            } else {
              return (
                <th key={index} className="text-center">
                  {data[1]}
                </th>
              );
            }
          })}
        </tr>
      </thead>
    );
  }

  let value_new = new Array();
  let element_body = "";
  if (!data[0] || data[0].length <= 0) {
    element_body = (
      <td className="text-center" colSpan={header.length}>
        <i>Không có dữ liệu.</i>
      </td>
    );
  } else {
    let list_new = [...data[0]];
    element_body = list_new.map((value, keys) => {
      value_new = [...value];
      if (customColumn.stt_column) {
        value_new.unshift(Array("stt", keys + 1));
      }

      if (customColumn.select_column && customColumn.edit_column) {
        value_new = [
          ...value_new,
          Array("icon_edit", "edit"),
          Array("icon_select", "select"),
        ];
      } else if (!customColumn.select_column && customColumn.edit_column) {
        value_new = [...value_new, Array("icon_edit", "edit")];
      } else if (customColumn.select_column && !customColumn.edit_column) {
        value_new = [...value_new, Array("icon_select", "select")];
      } else {
        value_new = [...value_new];
      }

      let arr_cols_id = new Array();
      return (
        <tr key={keys}>
          {value_new.map((data, index) => {
            if (id_column.indexOf(data[0]) !== -1) {
              arr_cols_id.push(data[1]);
            }
            let id_cols = arr_cols_id.join(__span);
            if (id_column.length > 0) {
              id_cols_custom.push(arr_cols_id);
            }
            let key_col = value_new[index][0];

            if (data[0] == "icon_edit") {
              return (
                <td className="text-center" key={index}>
                  {" "}
                  <FiEdit
                    className="icon-edit"
                    onClick={() => handleEdit(id_cols)}
                  ></FiEdit>
                </td>
              );
            }

            if (data[0] == "icon_select") {
              return (
                <td
                  className="d-flex justify-content-center align-items-center"
                  key={index}
                >
                  <Checkbox
                    key={id_cols}
                    type="checkbox"
                    name={"chk_" + name + "_" + index}
                    id={id_cols}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(id_cols)}
                    label={""}
                  ></Checkbox>
                </td>
              );
            }
            if (hideCols[data[0]]) {
            } else {
              return (
                <td
                  key={index}
                  className={data[2] ? "text-center " + data[2] : "text-center"}
                >
                  {data[1]}
                </td>
              );
            }
          })}
        </tr>
      );
    });
  }

  let footer = "";
  if (customColumn.select_column) {
    if (data[0].length > 0) {
      footer = (
        <tr>
          <td
            colSpan={value_new.length - (hide_column.length + 1)}
            align="center"
          >
            Chọn tất cả
          </td>
          <td className="d-flex justify-content-center align-items-center">
            <Checkbox
              type="checkbox"
              name="chk_selectAll"
              id="selectAll"
              handleClick={handleSelectAll}
              isChecked={isCheckAll}
              label={""}
            ></Checkbox>
          </td>
        </tr>
      );
    }
  }

  let pagi = "";
  if (data[0].length <= 0) {
  } else {
    pagi = (
      <tr>
        <td colSpan={value_new.length}>
          <Pagination
            data={data}
            url={"/" + name}
            pagination={pagination}
            changePage={handleChangePage}
          ></Pagination>
        </td>
      </tr>
    );
  }
  let content = <div></div>;
  content = (
    <Table striped bordered hover responsive className="mb-0">
      {element_header}
      <tbody>
        {element_body}
        {footer}
        {pagi}
      </tbody>
    </Table>
  );

  return <div>{content}</div>;
};

ListNormal.propTypes = {
  customColumn: PropTypes.object,
  name: PropTypes.string,
  hide_column: PropTypes.array,
  id_column: PropTypes.array,
};

ListNormal.defaultProps = {
  customColumn: {
    select_column: true,
    edit_column: true,
    stt_column: true,
  },

  name: "list",
  hide_column: new Array("_id"),
  id_column: [],
};

export default ListNormal;
