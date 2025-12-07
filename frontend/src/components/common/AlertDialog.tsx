import React from 'react';
import Modal from './Modal';
import './ConfirmDialog.css'; // Reusing styles from ConfirmDialog for consistency

export type AlertDialogType = 'success' | 'error' | 'warning' | 'info';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: AlertDialogType;
  onClose: () => void;
  buttonText?: string;
}

/**
 * Componente de alerta simples (feedback).
 * Notificações modais.
 */
const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  buttonText = 'OK',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      size="small"
      footer={
        <div className="confirm-dialog-footer" style={{ justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            {buttonText}
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

export default AlertDialog;
