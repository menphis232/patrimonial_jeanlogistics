import { parse, isValid, format } from 'date-fns';

/**
 * Convierte una fecha de formato string en un formato de fecha deseado utilizando la biblioteca date-fns.
 * 
 * @param dateString La fecha en formato string a analizar.
 * @param formatDate El formato de fecha deseado para la salida.
 * @returns La fecha en el formato deseado o null si no se puede analizar la fecha con ninguno de los formatos de fecha válidos.
 */
export function formatDates(dateString: string, formatDate: any): string | null {

    if (!dateString)
      return null;

    const DATE_FORMATS = [
      "yyyy-MM-dd'T'HH:mm:ss",
      "yyyy-MM-dd HH:mm:ss",
      "yyyy-MM-dd",
      "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'"
    ];

    let parsedDate: Date;

    for (const DATE_FORMAT of DATE_FORMATS) {

      parsedDate = parse(dateString, DATE_FORMAT, new Date());

      if (isValid(parsedDate))
        return format(parsedDate, formatDate);
    }

    console.warn(`No se puede analizar la fecha "${dateString}" con ningún formato de fecha válido`);
    return null;
}