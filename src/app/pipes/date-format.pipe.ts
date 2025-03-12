import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    // Se a data já estiver no formato dd/**/****, retorna sem alteração
    if (/^\d{2}\/\*{2}\/\*{4}$/.test(value)) {
      return value;
    }

    // Verifica se a data está no formato dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value; // Já está formatada corretamente
    }

    // Verifica se a data está no formato yyyy-mm-dd e converte para dd/mm/yyyy
    const dateParts = value.split('-');
    if (dateParts.length === 3) {
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    return value; // Retorna sem modificação caso não atenda os formatos esperados
  }
}
