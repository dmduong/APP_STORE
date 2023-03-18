import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Select.css";
import { Form } from "react-bootstrap";

const Select = (props) => {
  const { id, name, values, data, handleChange, size, disabled } = props;
  const [limit, setLimit] = useState(values);
  const handleChangeSelect = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;

    setLimit(value);
    handleChange(value);
  };

  return (
    <Form.Select
      aria-label={values}
      onChange={handleChangeSelect}
      value={limit}
      name={name}
      id={id}
      size={size}
      disabled={disabled}
    >
      {data.map((v, k) => (
        <option key={k} value={v.value}>
          {v.name}
        </option>
      ))}
    </Form.Select>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.array,
  values: PropTypes.number,
  handleChange: PropTypes.func,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};

Select.defaultProps = {
  id: "limit_record",
  name: "limit_record",
  data: Array(5, 10, 20, 30),
  values: 10,
  handleChange: null,
  size: "",
  disabled: false,
};

export default Select;
