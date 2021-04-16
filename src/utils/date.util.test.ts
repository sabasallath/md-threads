import { DateUtil } from './date.util';
import Constant from '../config/constant';

test('Date formatting test', () => {
  const epoch = new Date(0);
  const epochISO = epoch.toISOString();
  expect(DateUtil.formatDateForDisplay(epochISO).length).toBe(Constant.DATE_DISPLAY_FORMAT.length);
  expect(DateUtil.formatDateForDisplay(epochISO)).not.toBe(Constant.INVALID_DATE_FORMAT_MESSAGE);

  const epochUTC = epoch.toUTCString();
  expect(DateUtil.formatDateForDisplay(epochUTC)).toBe(Constant.INVALID_DATE_FORMAT_MESSAGE);
  expect(DateUtil.formatDateForDisplay('')).toBe('');
});
