// CPF Service - Desacoplado para facilitar integração com APIs reais

export interface CpfData {
  cpf: string;
  name: string;
  birthDate: string;
  status: 'Regular' | 'Irregular' | 'Cancelado';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface CpfLookupResponse {
  success: boolean;
  data?: CpfData;
  error?: string;
}

class CpfService {
  private baseUrl = process.env.VITE_CPF_API_URL || '';
  private apiKey = process.env.VITE_CPF_API_KEY || '';

  /**
   * Validates CPF format and check digits
   */
  public validateCpf(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, "");
    
    if (cleaned.length !== 11) return false;
    if (cleaned === cleaned[0].repeat(11)) return false;

    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cleaned.charAt(9))) return false;

    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    
    return checkDigit === parseInt(cleaned.charAt(10));
  }

  /**
   * Formats CPF with dots and dash
   */
  public formatCpf(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  }

  /**
   * Removes formatting from CPF
   */
  public cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  /**
   * Lookup CPF data from external API
   * Replace this implementation with your actual API integration
   */
  public async lookupCpf(cpf: string): Promise<CpfLookupResponse> {
    try {
      const cleanedCpf = this.cleanCpf(cpf);
      
      if (!this.validateCpf(cleanedCpf)) {
        return {
          success: false,
          error: 'CPF inválido'
        };
      }

      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/cpf/${cleanedCpf}`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response for demonstration
      const mockData: CpfData = {
        cpf: this.formatCpf(cleanedCpf),
        name: this.generateMockName(),
        birthDate: this.generateMockBirthDate(),
        status: this.generateMockStatus(),
        address: {
          street: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567"
        }
      };

      return {
        success: true,
        data: mockData
      };

    } catch (error) {
      console.error('CPF lookup error:', error);
      return {
        success: false,
        error: 'Erro ao consultar CPF. Tente novamente.'
      };
    }
  }

  // Mock data generators for demonstration
  private generateMockName(): string {
    const names = [
      'João da Silva',
      'Maria Oliveira',
      'Pedro Santos',
      'Ana Costa',
      'Carlos Pereira',
      'Lucia Ferreira'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateMockBirthDate(): string {
    const year = 1950 + Math.floor(Math.random() * 50);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  private generateMockStatus(): 'Regular' | 'Irregular' | 'Cancelado' {
    const statuses: ('Regular' | 'Irregular' | 'Cancelado')[] = ['Regular', 'Irregular', 'Cancelado'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

export const cpfService = new CpfService();