/**
 * Classe para validação de formulários
 * Contém regras de validação reutilizáveis
 */
export class FormValidator {

  // Valida email usando regex
  static validateEmail(email: string): { valid: boolean; message: string } {
    if (!email.trim()) {
      return { valid: false, message: 'Email é obrigatório' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Email inválido' };
    }

    return { valid: true, message: '' };
  }

  // Valida username
  static validateUsername(username: string, minLength: number = 3): { valid: boolean; message: string } {
    if (!username.trim()) {
      return { valid: false, message: 'Usuário é obrigatório' };
    }

    if (username.length < minLength) {
      return { valid: false, message: `Usuário deve ter no mínimo ${minLength} caracteres` };
    }

    return { valid: true, message: '' };
  }


  // Valida password
  static validatePassword(password: string, minLength: number = 6): { valid: boolean; message: string } {
    if (!password.trim()) {
      return { valid: false, message: 'Senha é obrigatória' };
    }

    if (password.length < minLength) {
      return { valid: false, message: `Senha deve ter no mínimo ${minLength} caracteres` };
    }

    return { valid: true, message: '' };
  }

  // Valida se duas senhas conferem
  static validatePasswordMatch(password: string, confirmPassword: string): { valid: boolean; message: string } {
    if (!confirmPassword.trim()) {
      return { valid: false, message: 'Confirmar senha é obrigatório' };
    }

    if (password !== confirmPassword) {
      return { valid: false, message: 'As senhas não conferem' };
    }

    return { valid: true, message: '' };
  }

  // Valida um campo genérico obrigatório
  static validateRequired(value: string, fieldName: string): { valid: boolean; message: string } {
    if (!value.trim()) {
      return { valid: false, message: `${fieldName} é obrigatório` };
    }

    return { valid: true, message: '' };
  }

  // Valida múltiplos campos de uma vez
  static validateMultiple(validations: Array<{ valid: boolean; message: string }>): { valid: boolean; messages: string[] } {
    const messages = validations
      .filter((validation) => !validation.valid)
      .map((validation) => validation.message);

    return {
      valid: messages.length === 0,
      messages,
    };
  }
}
