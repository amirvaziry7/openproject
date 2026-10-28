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

import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { persianCalendarPlugin } from './persian-calendar.plugin';
import { localizePersianDateInput, observePersianDateInputs } from './persian-date-input';
import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { DatePicker } from './datepicker';
import { ConfigurationService } from 'core-app/core/config/configuration.service';
import { I18nService } from 'core-app/core/i18n/i18n.service';
import { WeekdayService } from 'core-app/core/days/weekday.service';

describe('Persian date selection', () => {
  let input:HTMLInputElement;
  let picker:Instance;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.append(input);
  });

  afterEach(() => { picker?.destroy(); input.remove(); });

  const day = (date:string) => picker.calendarContainer
    .querySelector<HTMLElement>(`[data-calendar-date="${date}"]`)!;

  it('renders a real leap-year Esfand and emits Gregorian dates', () => {
    const changed = vi.fn();
    picker = flatpickr(input, {
      defaultDate: '2025-03-20', plugins: [persianCalendarPlugin()], onChange: changed,
    });
    expect(day('1403/12/30').textContent).toBe('30');
    day('1403/12/30').click();
    expect(input.value).toBe('2025-03-20');
    expect(changed).toHaveBeenCalled();
  });

  it('navigates across Nowruz using Persian month boundaries', () => {
    picker = flatpickr(input, { defaultDate: '2025-03-20', plugins: [persianCalendarPlugin()] });
    const buttons = picker.calendarContainer.querySelectorAll<HTMLButtonElement>('.op-persian-calendar--header button');
    buttons[1].click();
    expect(day('1404/01/01')).not.toBeNull();
    expect(day('1404/01/31')).not.toBeNull();
    day('1404/01/01').click();
    expect(input.value).toBe('2025-03-21');
  });

  it('preserves min/max and disabled day restrictions', () => {
    picker = flatpickr(input, {
      defaultDate: '2025-03-21', minDate: '2025-03-21', maxDate: '2025-03-24',
      disable: ['2025-03-22'], plugins: [persianCalendarPlugin()],
    });
    day('1404/01/02').click();
    expect(input.value).toBe('2025-03-21');
    day('1404/01/05').click();
    expect(input.value).toBe('2025-03-21');
    day('1404/01/04').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(input.value).toBe('2025-03-24');
  });

  it('selects ranges across Persian months with ISO values', () => {
    picker = flatpickr(input, { defaultDate: '2025-03-20', mode: 'range', showMonths: 2, plugins: [persianCalendarPlugin()] });
    day('1404/01/02').click();
    expect(picker.selectedDates).toHaveLength(2);
    expect(input.value).toBe('2025-03-20 to 2025-03-22');
  });

  it('leaves the standard English picker unchanged without the plugin', () => {
    picker = flatpickr(input, { defaultDate: '2025-03-21' });
    expect(picker.calendarContainer.querySelector('.op-persian-calendar')).toBeNull();
    expect(picker.currentYear).toBe(2025);
  });

  it('closes the Persian popup with Escape', () => {
    picker = flatpickr(input, { defaultDate: '2025-03-21', plugins: [persianCalendarPlugin()] });
    picker.open();
    expect(picker.isOpen).toBe(true);
    day('1404/01/01').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(picker.isOpen).toBe(false);
  });

  it('preserves the afternoon time when another Persian day is selected', () => {
    picker = flatpickr(input, { defaultDate: '2025-03-21 14:30', dateFormat: 'Y-m-d H:i', enableTime: true,
      plugins: [persianCalendarPlugin()] });
    day('1404/01/02').click();
    expect(input.value).toBe('2025-03-22 14:30');
  });

  it('integrates with the shared picker using a Persian visible input and ISO submitted input', () => {
    TestBed.configureTestingModule({ providers: [
      { provide: ConfigurationService, useValue: { startOfWeek: () => 6 } },
      { provide: WeekdayService, useValue: { loadWeekdays: () => of([]) } },
      { provide: I18nService, useValue: { locale: 'fa', t: (key:string) => {
        if (key.includes('day_names')) return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        if (key.includes('month_names')) return ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return 'week';
      } } },
    ] });
    input.id = 'shared-picker';
    input.name = 'date';
    const wrapper = new DatePicker(TestBed.inject(Injector), input.id, '2025-03-20', { allowInput: true }, input);
    picker = wrapper.datepickerInstance;
    expect(picker.altInput?.value).toBe('1403/12/30');
    expect(picker.altInput?.id).toBe('shared-picker');
    expect(input.value).toBe('2025-03-20');
    picker.setDate('1404/01/01', true, 'persian-date');
    expect(input.value).toBe('2025-03-21');
    expect(picker.altInput?.value).toBe('1404/01/01');
    expect(picker.l10n.firstDayOfWeek).toBe(6);
  });

  it('shows and accepts Jalali text while preserving submitted form values', () => {
    input.id = 'test-date';
    input.name = 'work_package[start_date]';
    input.value = '2025-03-20';
    const cleanup = localizePersianDateInput(input);
    const visible = document.getElementById('test-date-display') as HTMLInputElement;
    expect(visible.value).toBe('1403/12/30');
    visible.value = '۱۴۰۴/۰۱/۰۱';
    visible.dispatchEvent(new Event('input'));
    expect(input.value).toBe('2025-03-21');
    input.value = '2026-10-27';
    expect(visible.value).toBe('1405/08/05');
    cleanup();
    expect(input.type).toBe('text');
    expect(input.value).toBe('2026-10-27');
  });

  it('restores Persian inputs after a server preview morphs the form', async () => {
    input.id = 'preview-date';
    input.value = '2025-03-20';
    const root = document.createElement('div');
    input.replaceWith(root);
    root.append(input);
    const destroy = observePersianDateInputs(root, [input.id]);
    try {
      document.getElementById('preview-date-display')!.remove();
      input.type = 'text';
      input.value = '2025-03-21';
      await vi.waitFor(() => expect(document.getElementById('preview-date-display')).not.toBeNull());
      expect((document.getElementById('preview-date-display') as HTMLInputElement).value).toBe('1404/01/01');
      expect(input.type).toBe('hidden');
      const replacement = document.createElement('input');
      replacement.id = input.id;
      replacement.value = '2026-10-27';
      input.replaceWith(replacement);
      await vi.waitFor(() => expect((document.getElementById('preview-date-display') as HTMLInputElement).value).toBe('1405/08/05'));
      expect(document.querySelectorAll('#preview-date-display')).toHaveLength(1);
      expect(replacement.value).toBe('2026-10-27');
    } finally { destroy(); root.remove(); }
  });
});
