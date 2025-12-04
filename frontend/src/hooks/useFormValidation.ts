import { useState, useCallback } from 'react';
import { FormValidator } from '../utils/FormValidator';

export interface ValidationRules {
  [fieldName: string]: {
    type: 'email' | 'username' | 'password' | 'confirmPassword' | 'required';
    minLength?: number;
    matchField?: string;
  };
}

export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Hook customizado para validação de formulários
 * Usa a classe FormValidator para as regras
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  // Valida um campo individual
  const validateField = useCallback(
    (fieldName: string, value: string, formData?: Record<string, string>, rules?: ValidationRules) => {
      const rule = rules?.[fieldName];

      if (!rule) return null;

      let result;

      switch (rule.type) {
        case 'email':
          result = FormValidator.validateEmail(value);
          break;

        case 'username':
          result = FormValidator.validateUsername(value, rule.minLength || 3);
          break;

        case 'password':
          result = FormValidator.validatePassword(value, rule.minLength || 6);
          break;

        case 'confirmPassword':
          if (rule.matchField && formData) {
            result = FormValidator.validatePasswordMatch(formData[rule.matchField], value);
          } else {
            result = FormValidator.validateRequired(value, 'Confirmar senha');
          }
          break;

        case 'required':
          result = FormValidator.validateRequired(value, fieldName);
          break;

        default:
          result = { valid: true, message: '' };
      }

      if (!result.valid) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: result.message,
        }));
      } else {
        clearError(fieldName);
      }

      return result;
    },
    []
  );

  // Valida todos os campos do formulário
  const validateForm = useCallback(
    (formData: Record<string, string>, rules: ValidationRules): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      Object.keys(rules).forEach((fieldName) => {
        const result = validateField(fieldName, formData[fieldName], formData, rules);
        if (result && !result.valid) {
          newErrors[fieldName] = result.message;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  // Limpa erro de um campo específico
  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);


  // Limpa todos os erros
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Verifica se um campo tem erro
  const hasError = useCallback((fieldName: string): boolean => {
    return !!errors[fieldName];
  }, [errors]);

  // Obtém a mensagem de erro de um campo
  const getError = useCallback((fieldName: string): string => {
    return errors[fieldName] || '';
  }, [errors]);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    hasError,
    getError,
  };
};
