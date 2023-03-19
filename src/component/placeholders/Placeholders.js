import React from "react";
import PropTypes from "prop-types";
import "./Placeholders.css";
import { newArray } from "../../config/utill";

const Placeholders = (props) => {
  const { numberCols, numberRows, type, styleCustom } = props;
  let col_span = newArray(numberCols);
  let row_span = newArray(numberRows);
  let row_span_header = newArray(1);
  let placeholders = "";
  let placeholders_header = "";
  if (type === "table") {
    let number_col = (
      <>
        {col_span.map((value, index) => {
          return (
            <td key={index} scope="col" className="text-center">
              <div style={styleCustom} className="items-place-holder">
                .
              </div>
            </td>
          );
        })}
      </>
    );

    let number_col_header = (
      <>
        {col_span.map((value, index) => {
          return (
            <th key={index} scope="col" className="text-center">
              <div className="items-place-holder-header">
                <div style={styleCustom} className="items-con">
                  .
                </div>
              </div>
            </th>
          );
        })}
      </>
    );

    let number_rows = (
      <>
        {row_span.map((value, index) => {
          return <tr key={index}>{number_col}</tr>;
        })}
      </>
    );

    let number_rows_header = (
      <>
        {row_span_header.map((value, index) => {
          return <tr key={index}>{number_col_header}</tr>;
        })}
      </>
    );

    placeholders_header = <>{number_rows_header}</>;

    placeholders = <>{number_rows}</>;
  }

  return (
    <table className="table mb-0">
      <thead className="thead-light">{placeholders_header}</thead>
      <tbody>{placeholders}</tbody>
    </table>
  );
};

Placeholders.propTypes = {
  header: PropTypes.bool,
  body: PropTypes.bool,
  numberCols: PropTypes.number,
  numberRows: PropTypes.number,
  type: PropTypes.string,
  styleCustom: PropTypes.object,
};

Placeholders.defaultProps = {
  header: false,
  body: false,
  numberCols: 6,
  numberRows: 1,
  type: "table",
  styleCustom: null,
};

export default Placeholders;
