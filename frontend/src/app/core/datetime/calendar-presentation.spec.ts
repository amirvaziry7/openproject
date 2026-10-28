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

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { calendarPresentation } from './calendar-presentation';

describe('Calendar date labels', () => {
  it('displays Persian dates while retaining Gregorian event dates', () => {
    const element = document.createElement('div');
    document.body.append(element);
    const calendar = new Calendar(element, {
      plugins: [dayGridPlugin], initialView: 'dayGridMonth', initialDate: '2026-10-27', timeZone: 'UTC',
      events: [{ id: '1', start: '2026-10-27', title: 'Example' }], ...calendarPresentation('fa'),
    });
    try {
      calendar.render();
      expect(element.querySelector('[data-date="2026-10-27"] .fc-daygrid-day-number')?.textContent).toBe('5');
      expect(calendar.view.title).toContain('1405');
      expect(calendar.getEventById('1')?.startStr).toBe('2026-10-27');
    } finally { calendar.destroy(); element.remove(); }
  });

  it('preserves all default options in English', () => {
    expect(calendarPresentation('en')).toEqual({});
  });
});
