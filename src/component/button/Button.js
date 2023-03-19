import React from "react";
import PropTypes from "prop-types";
import "./Button.css";
import { Button } from "react-bootstrap";

const ButtonCustom = (props) => {
  const { title, color, size, onClick } = props;
  return (
    <>
      {" "}
      <Button
        size={size}
        variant={color}
        onClick={() => {
          onClick(true);
        }}
      >
        {title}
      </Button>{" "}
    </>
  );
};

ButtonCustom.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

ButtonCustom.defaultProps = {
  title: "Button",
  color: "success",
  size: "",
  onClick: null,
};

export default ButtonCustom;
