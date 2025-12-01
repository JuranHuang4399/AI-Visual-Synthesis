/**
 * Form Field Component
 * Unified form field component for input and textarea
 * 
 * Props:
 * - label: Field label
 * - name: Field name
 * - value: Field value
 * - onChange: Change handler
 * - placeholder: Placeholder text
 * - required: Whether field is required
 * - type: Field type ('text', 'textarea', etc.)
 * - rows: Number of rows for textarea (default: 4)
 */
function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'text',
  rows = 4
}) {
  return (
    <div className="mb-4">
      <label className="block text-cyber-cyan font-semibold mb-2">
        {label} {required && <span className="text-cyber-pink">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="textarea-cyber"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input-cyber"
        />
      )}
    </div>
  );
}

export default FormField;

