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

import moment from 'moment-timezone';
import 'moment/locale/fa';
import { formatCalendarDate, parsePersianDate, persianPeriod } from './persian-calendar';

describe('Persian calendar presentation', () => {
  beforeEach(() => { moment.locale('en'); });
  afterEach(() => { moment.locale('en'); });

  it.each([
    ['2024-03-19', '1402/12/29'],
    ['2024-03-20', '1403/01/01'],
    ['2025-03-20', '1403/12/30'],
    ['2025-03-21', '1404/01/01'],
    ['2026-05-21', '1405/02/31'],
    ['2026-10-27', '1405/08/05'],
  ])('displays %s as %s and round-trips to the same ISO date', (iso, solar) => {
    expect(formatCalendarDate(moment(iso), 'YYYY/MM/DD', 'fa')).toBe(solar);
    expect(parsePersianDate(solar, 'YYYY/MM/DD')?.date).toBe(iso);
    expect(moment(iso).format('YYYY-MM-DD')).toBe(iso);
  });

  it('keeps English Gregorian and changes only the chosen presentation locale', () => {
    expect(formatCalendarDate(moment('2026-10-27'), 'YYYY-MM-DD', 'en')).toBe('2026-10-27');
    expect(formatCalendarDate(moment('2026-10-27'), 'YYYY-MM-DD', 'fa')).toBe('1405-08-05');
  });

  it('preserves literal text, weekday and time while using Persian month names', () => {
    const date = moment('2026-10-27T14:30').locale('en');
    expect(formatCalendarDate(date, '[Date:] dddd D MMMM YYYY HH:mm', 'fa'))
      .toBe('Date: Tuesday 5 آبان 1405 14:30');
  });

  it('accepts Persian and Arabic digits and rejects invalid leap days', () => {
    expect(parsePersianDate('۱۴۰۳/۱۲/۳۰', 'YYYY/MM/DD')?.date).toBe('2025-03-20');
    expect(parsePersianDate('١٤٠٤/٠١/٠١', 'YYYY/MM/DD')?.date).toBe('2025-03-21');
    expect(parsePersianDate('1404/12/30', 'YYYY/MM/DD')).toBeNull();
    expect(parsePersianDate('1405/07/31', 'YYYY/MM/DD')).toBeNull();
  });

  it('uses Persian month and year boundaries for timeline rendering', () => {
    const [start, end] = persianPeriod(moment('2025-03-20'), 'year');
    expect(start.format('YYYY-MM-DD')).toBe('2024-03-20');
    expect(end.format('YYYY-MM-DD')).toBe('2025-03-20');
    const [monthStart, monthEnd] = persianPeriod(moment('2026-10-27'), 'month');
    expect(monthStart.format('YYYY-MM-DD')).toBe('2026-10-23');
    expect(monthEnd.format('YYYY-MM-DD')).toBe('2026-11-21');
  });
});
