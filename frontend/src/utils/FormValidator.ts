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

  // Valida telefone (formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
  static validatePhone(phone: string): { valid: boolean; message: string } {
    // Remove caracteres não numéricos para verificar tamanho
    const cleanPhone = phone.replace(/\D/g, '');

    // Verifica se tem 10 ou 11 dígitos
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return { valid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
    }

    // Regex para formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: 'Formato inválido. Use (XX) XXXXX-XXXX' };
    }
    return { valid: true, message: '' };
  }
}
