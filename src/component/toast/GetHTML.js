import React from "react";

const GetHTML = (props) => {
  return (
    <div className="pl-2 pr-2">
      <ul>
        {props.title.map((value, index) => (
          <li style={{marginBottom: '0px', width: 'auto', fontSize: '13px', textAlign: 'justify'}} key={index}>{value.msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetHTML;
