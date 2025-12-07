import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface InputDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  required?: boolean;
}

/**
 * Modal com campo de entrada de texto.
 */
const InputDialog: React.FC<InputDialogProps> = ({
  isOpen,
  title,
  message,
  label = 'Valor',
  placeholder = '',
  initialValue = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  required = true,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError('');
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (required && !value.trim()) {
      setError('Este campo é obrigatório.');
      return;
    }
    onConfirm(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="small"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="input-dialog-form"
            className="btn btn-primary"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <form id="input-dialog-form" onSubmit={handleSubmit}>
        {message && <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>{message}</p>}

        <div className="form-group">
          {label && <label htmlFor="input-dialog-field">{label}</label>}
          <input
            id="input-dialog-field"
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder={placeholder}
            autoFocus
          />
          {error && <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{error}</small>}
        </div>
      </form>
    </Modal>
  );
};

export default InputDialog;
