import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const LableCustom = (props) => {
  const { title, onclick, htmlFor, styleCustom, required } = props;
  return (
    <>
      {" "}
      <Form.Label
        htmlFor={htmlFor}
        onClick={() => {
          if (onclick) {
            onclick(true);
          }
        }}
      >
        <span style={styleCustom}>{title}</span>{" "}
        {required ? <span className="text-danger">*</span> : <span></span>}
      </Form.Label>
    </>
  );
};

LableCustom.propTypes = {
  required: PropTypes.bool,
  title: PropTypes.string,
  htmlFor: PropTypes.string,
  styleCustom: PropTypes.object,
  onclick: PropTypes.func,
};

LableCustom.defaultProps = {
  required: false,
  title: "Lable số 1",
  htmlFor: "",
  styleCustom: {},
  onclick: null,
};

export default LableCustom;
