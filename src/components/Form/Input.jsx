import React, { useEffect, useReducer } from "react";
import validator from "../../validators/validator";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": {
      return {
        ...state,
        value: action.value,
        isValid: validator(action.value, action.validations),
      };
    }
    default: {
      return state;
    }
  }
};

export default function Input(props) {
  const [mainInput, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    isTouched: false,
  });

  const { value, isValid, isTouched } = mainInput;
  const { id, onInputHandler } = props;

  useEffect(() => {
    onInputHandler(id, value, isValid);
  }, [value]);

  const onChangeHandler = (event) => {
    console.log(event.target.value);
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validations: props.validations,
      isValid: true,
    });
  };

  const onTouchHandler = () => {
    dispatch({
      type: "CHANGE",
      value: value,
      validations: props.validations,
      isValid: validator(value, props.validations),
      isTouched: true,
    });
  };

  const element =
    props.element === "input" ? (
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={value}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        className={`${props.className} ${!isValid && isTouched && "invalid"}`}
      />
    ) : (
      <textarea
        placeholder={props.placeholder}
        value={value}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        className={`${props.className} ${!isValid && isTouched && "invalid"}`}
      />
    );

  return <div className={`form-input ${props.className}`}>{element}</div>;
}
