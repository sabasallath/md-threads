import { format, parseISO } from 'date-fns';
import Constant from '../config/constant';

export class DateUtil {
  static formatDateForDisplay(isoDateString: string): string {
    if (!isoDateString) return isoDateString;
    let formattedDate;
    try {
      formattedDate = format(parseISO(isoDateString), Constant.DATE_DISPLAY_FORMAT);
    } catch (e) {
      // Since this is for display purpose only, errors are silenced
      return 'Invalid date format';
    }
    return formattedDate;
  }
}
