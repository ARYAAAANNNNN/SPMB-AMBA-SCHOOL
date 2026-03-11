/**
 * Reusable FormInput component.
 * Props:
 *   label, name, type, value, onChange, placeholder,
 *   required, hint, error, options (for select), rows (for textarea)
 */
export default function FormInput({
  label, name, type = 'text', value, onChange,
  placeholder = '', required = false, hint, error,
  options, rows, disabled = false,
}) {
  const inputProps = {
    id: name, name, value, onChange, disabled, placeholder,
    className: `form-control${error ? ' error' : ''}`,
  }

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}{required && <span className="req">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea {...inputProps} rows={rows || 3} style={{ resize: 'vertical' }} />
      ) : type === 'select' ? (
        <select {...inputProps}>
          <option value="">-- Pilih {label} --</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input {...inputProps} type={type} />
      )}

      {hint  && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">⚠ {error}</span>}
    </div>
  )
}