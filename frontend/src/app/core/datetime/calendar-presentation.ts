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

import { CalendarOptions } from '@fullcalendar/core';
import moment from 'moment-timezone';
import { formatCalendarDate } from './persian-calendar';

export function calendarPresentation(locale:string):CalendarOptions {
  if (locale !== 'fa') return {};

  const title:CalendarOptions['titleFormat'] = ({ start, end }) => {
    const first = formatCalendarDate(moment.utc(start.marker), 'D MMMM YYYY', locale);
    const last = end && formatCalendarDate(moment.utc(end.marker), 'D MMMM YYYY', locale);
    return last && first !== last ? `${first} – ${last}` : first;
  };
  return {
    titleFormat: title,
    dayCellContent: ({ date, view }) => {
      const zone = view.calendar.getOption('timeZone')!;
      const local = zone === 'local' ? moment(date) : moment(date).tz(zone);
      return formatCalendarDate(local, 'D', locale);
    },
    dayHeaderContent: ({ date, view, text }) => {
      if (view.type.includes('Month')) return text;
      const zone = view.calendar.getOption('timeZone')!;
      const local = zone === 'local' ? moment(date) : moment(date).tz(zone);
      return formatCalendarDate(local, 'ddd D MMMM', locale);
    },
  };
}
