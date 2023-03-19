import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import LableCustom from "../lable/LableCustom";

const InputCustom = (props) => {
  const {
    type,
    readOnly,
    name,
    value,
    id,
    onChange,
    label,
    required,
    styleInput,
    styleLable,
  } = props;
  return (
    <>
      <Form.Group className="mb-3">
        <LableCustom
          title={label}
          required={required}
          htmlFor={id}
          styleCustom={styleLable}
        ></LableCustom>
        <Form.Control
          type={type}
          readOnly={readOnly}
          name={name}
          value={value}
          id={id}
          style={styleInput}
          onChange={(e) => {
            onChange(e);
          }}
        />
      </Form.Group>
    </>
  );
};

InputCustom.propTypes = {
  type: PropTypes.string,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  styleInput: PropTypes.object,
  styleLable: PropTypes.object,
};

InputCustom.defaultProps = {
  type: "text",
  readOnly: false,
  name: "input-text",
  id: "input-text",
  value: "",
  onChange: null,
  label: "Tên số 1",
  required: false,
  styleInput: {},
  styleLable: {},
};

export default InputCustom;
