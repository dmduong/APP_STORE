import React from "react";
import Form from 'react-bootstrap/Form';

const Checkbox = (props) => {
  const { id, type, name, handleClick, isChecked, label } = props;
  return (
    <div>
      <Form.Check
        id={id}
        name={name}
        type={type}
        onChange={handleClick}
        checked={isChecked}
        label={label}
      />
    </div>
  );
};

export default Checkbox;
