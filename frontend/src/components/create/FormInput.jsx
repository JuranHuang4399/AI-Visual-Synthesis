function FormInput({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false 
}) {
  return (
    <div className="mb-4">
      <label className="block text-cyber-cyan font-semibold mb-2">
        {label} {required && <span className="text-cyber-pink">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-cyber"
      />
    </div>
  );
}

export default FormInput;
