import React from "react";
import PropTypes from "prop-types";
import "./Button.css";
import { Button } from "react-bootstrap";

const ButtonCustom = (props) => {
  const { title, color, size, onClick, type, className, style } = props;
  return (
    <>
      {" "}
      <Button
        size={size}
        variant={color}
        onClick={
          onClick
            ? () => {
                onClick(true);
              }
            : null
        }
        type={type}
        className={className}
        style={style}
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
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

ButtonCustom.defaultProps = {
  title: "Button",
  color: "success",
  size: "",
  onClick: null,
  type: "button",
  className: "btn btn-default",
  style: {},
};

export default ButtonCustom;
