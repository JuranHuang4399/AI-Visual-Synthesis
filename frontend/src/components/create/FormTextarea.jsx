function FormTextarea({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  required = false 
}) {
  return (
    <div className="mb-4">
      <label className="block text-cyber-cyan font-semibold mb-2">
        {label} {required && <span className="text-cyber-pink">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="textarea-cyber"
      />
    </div>
  );
}

export default FormTextarea;
