import { useState } from 'react';
import { ConfirmDialogType } from '../components/common/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ConfirmDialogType;
  confirmText: string;
  cancelText: string;
  isDangerous: boolean;
}

export const useConfirmDialog = () => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    isDangerous: false,
  });

  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        isDangerous: options.isDangerous || false,
      });
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolveCallback) {
      resolveCallback(true);
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (resolveCallback) {
      resolveCallback(false);
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    ...state,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
