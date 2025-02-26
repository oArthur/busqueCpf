import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: true
})
export class CpfFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    const cpf = value.replace(/\D/g, ''); // Remove não numéricos
    if (cpf.length !== 11) return value; // Se não tiver 11 dígitos, retorna sem formatação

    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
  }
}
