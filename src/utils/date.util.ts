import { format, parseISO } from 'date-fns';

export class DateUtil {
  // todo test
  static formatDate(isoDateString: string): string {
    return format(parseISO(isoDateString), 'dd/MM/yyyy - HH:mm');
  }
}
