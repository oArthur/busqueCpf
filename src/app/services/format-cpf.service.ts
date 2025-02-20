import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatCpfService {

  constructor() {}

  formatCpf(value: string = ''): string {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formattedValue = value;
    if (value.length >= 3) formattedValue = `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length >= 6) formattedValue = `${formattedValue.slice(0, 7)}.${formattedValue.slice(7)}`;
    if (value.length >= 9) formattedValue = `${formattedValue.slice(0, 11)}-${formattedValue.slice(11)}`;

    return formattedValue;
  }

  validarCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
  }
}

