import React from "react";
import "../../styles/FormInput.css";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  showLabel = false,
  pattern = null,
}) => {
  return (
    <div className="form-input-component form-input-container">
      {label && showLabel && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? "input-error" : ""}`}
        required={required}
        pattern={pattern}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormInput;
