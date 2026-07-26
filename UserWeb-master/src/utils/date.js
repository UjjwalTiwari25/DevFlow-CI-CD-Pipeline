const { format } = require('date-fns');
const { enUS } = require('date-fns/locale');
const { toZonedTime } = require('date-fns-tz');

function displayInTimezone(
  isoDate,
  timezone,
  displayFormat = 'YYYY-MM-dd',
  locale = enUS
) {
  return format(toZonedTime(isoDate, timezone), displayFormat, {
    timeZone: timezone,
    locale,
  });
}

module.exports = {
  displayInTimezone,
};
