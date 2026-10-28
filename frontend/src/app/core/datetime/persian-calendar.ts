//-- copyright
// OpenProject is an open source project management software.
// Copyright (C) the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import moment, { Moment } from 'moment-timezone';
import { isValidJalaaliDate, toGregorian, toJalaali } from 'jalaali-js';

const tokens = /\[[^\]]*\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|Q|./g;

export function persianMonthName(month:number):string {
  const { gy, gm, gd } = toGregorian(1400, month, 1);
  return new Intl.DateTimeFormat('fa-IR', { month: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(gy, gm - 1, gd)));
}

function expandedFormat(date:Moment, format:string):string {
  return format.replace(/\[[^\]]*\]|L{1,4}|l{1,4}/g, (token) => (
    token.startsWith('[') ? token : date.localeData().longDateFormat(token as moment.LongDateFormatKey) || token
  ));
}

export function formatCalendarDate(date:Moment, format:string, locale:string):string {
  if (locale !== 'fa' || !date.isValid()) {
    return date.format(format);
  }

  const { jy, jm, jd } = toJalaali(date.year(), date.month() + 1, date.date());
  const values:Record<string, string> = {
    YYYY: String(jy).padStart(4, '0'),
    YY: String(jy % 100).padStart(2, '0'),
    M: String(jm),
    MM: String(jm).padStart(2, '0'),
    MMM: persianMonthName(jm),
    MMMM: persianMonthName(jm),
    D: String(jd),
    DD: String(jd).padStart(2, '0'),
    Q: String(Math.ceil(jm / 3)),
  };
  const localized = expandedFormat(date, format).replace(tokens, (token) => (
    values[token] ? `[${values[token]}]` : token
  ));
  return date.format(localized);
}

export function persianPeriod(date:Moment, unit:'month'|'quarter'|'year'):[Moment, Moment] {
  const { jy, jm } = toJalaali(date.year(), date.month() + 1, date.date());
  const startMonth = unit === 'year' ? 1 : unit === 'quarter' ? Math.floor((jm - 1) / 3) * 3 + 1 : jm;
  const months = unit === 'year' ? 12 : unit === 'quarter' ? 3 : 1;
  const asMoment = (year:number, month:number) => {
    const { gy, gm, gd } = toGregorian(year, month, 1);
    return date.clone().startOf('day').date(1).year(gy).month(gm - 1).date(gd);
  };
  const nextMonth = startMonth + months;
  return [asMoment(jy, startMonth), asMoment(jy + Math.floor((nextMonth - 1) / 12), (nextMonth - 1) % 12 + 1).subtract(1, 'day').endOf('day')];
}

export function parsePersianDate(text:string, format:string, withTime = false):{ date:string; time:string }|null {
  const normalized = text.replace(/[۰-۹٠-٩]/g, (digit) => String(digit.charCodeAt(0) % 16));
  const patterns:Record<string, string> = {
    YYYY: '(?<year>\\d{4})', YY: '(?<shortYear>\\d{2})',
    M: '(?<month>\\d{1,2})', MM: '(?<month>\\d{2})',
    MMM: '(?<monthName>[^\\s]+)', MMMM: '(?<monthName>[^\\s]+)',
    D: '(?<day>\\d{1,2})', DD: '(?<day>\\d{2})',
  };
  const pattern = expandedFormat(moment(), format).match(tokens)!.map((token) => (
    patterns[token] || token.replace(/^\[|\]$/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )).join('');
  const parts = new RegExp(`^${pattern}${withTime ? ' (?<time>.+)' : ''}$`).exec(normalized)?.groups;
  if (!parts) return null;

  const year = Number(parts.year || `14${parts.shortYear}`);
  const month = parts.monthName
    ? Array.from({ length: 12 }, (_, i) => persianMonthName(i + 1)).indexOf(parts.monthName) + 1
    : Number(parts.month);
  const day = Number(parts.day);
  if (!isValidJalaaliDate(year, month, day)) return null;

  const { gy, gm, gd } = toGregorian(year, month, day);
  return { date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`, time: parts.time || '' };
}
