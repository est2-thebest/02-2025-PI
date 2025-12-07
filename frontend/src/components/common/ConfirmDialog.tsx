import React from 'react';
import Modal from './Modal';
import './ConfirmDialog.css';

export type ConfirmDialogType = 'success' | 'error' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // Para ações destrutivas (delete, etc)
}

/**
 * Modal de confirmação para ações críticas.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Fecha o modal
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="small"
      footer={
        <div className="confirm-dialog-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className={`confirm-dialog-content confirm-dialog-${type}`}>
        <p className="confirm-dialog-message">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
