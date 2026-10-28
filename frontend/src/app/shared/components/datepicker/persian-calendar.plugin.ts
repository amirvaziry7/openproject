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

import { Plugin } from 'flatpickr/dist/types/options';
import { DayElement } from 'flatpickr/dist/types/instance';
import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';
import { persianMonthName } from 'core-app/core/datetime/persian-calendar';

export function persianCalendarPlugin():Plugin {
  return (fp) => {
    let root:HTMLDivElement;
    let year:number;
    let month:number;
    // eslint-disable-next-line prefer-const
    let render:() => void;

    const jump = (date:Date) => {
      const parts = toJalaali(date);
      year = parts.jy;
      month = parts.jm;
    };
    const move = (offset:number) => {
      month += offset;
      if (month < 1) { month = 12; year -= 1; }
      if (month > 12) { month = 1; year += 1; }
      render();
    };
    const select = (date:Date) => {
      if (!fp.isEnabled(date, true)) return;
      if (fp.config.enableTime) {
        const previous = fp.selectedDates[fp.selectedDates.length - 1];
        date.setHours(previous?.getHours() ?? fp.config.defaultHour, previous?.getMinutes() ?? fp.config.defaultMinute,
          previous?.getSeconds() ?? fp.config.defaultSeconds);
      }
      let dates = [date];
      if (fp.config.mode === 'range' && fp.selectedDates.length === 1) {
        dates = [fp.selectedDates[0], date].sort((a, b) => a.getTime() - b.getTime());
        const cursor = new Date(dates[0]);
        while (cursor <= dates[1]) {
          if (!fp.isEnabled(cursor, true)) return;
          cursor.setDate(cursor.getDate() + 1);
        }
      } else if (fp.config.mode === 'multiple') {
        dates = fp.selectedDates.some((selected) => selected.toDateString() === date.toDateString())
          ? fp.selectedDates.filter((selected) => selected.toDateString() !== date.toDateString())
          : [...fp.selectedDates, date];
      }
      fp.setDate(dates, true);
      if (fp.config.closeOnSelect && !fp.config.enableTime
          && (fp.config.mode === 'single' || (fp.config.mode === 'range' && dates.length === 2))) fp.close();
    };
    render = () => {
      if (!root) return;
      root.replaceChildren();
      for (let offset = 0; offset < fp.config.showMonths; offset += 1) {
        const currentMonth = (month + offset - 1) % 12 + 1;
        const currentYear = year + Math.floor((month + offset - 1) / 12);
        const panel = document.createElement('section');
        const header = document.createElement('div');
        header.className = 'op-persian-calendar--header';
        const previous = document.createElement('button');
        previous.type = 'button';
        previous.textContent = '‹';
        previous.setAttribute('aria-label', window.I18n.t('js.label_previous'));
        previous.onclick = () => move(-1);
        const title = document.createElement('span');
        title.textContent = `${persianMonthName(currentMonth)} ${currentYear}`;
        title.setAttribute('aria-live', 'polite');
        const next = document.createElement('button');
        next.type = 'button';
        next.textContent = '›';
        next.setAttribute('aria-label', window.I18n.t('js.label_next'));
        next.onclick = () => move(1);
        header.append(previous, title, next);
        panel.append(header);
        const grid = document.createElement('div');
        grid.className = 'op-persian-calendar--grid';
        grid.setAttribute('role', 'group');
        grid.setAttribute('aria-label', title.textContent);
        for (let index = 0; index < 7; index += 1) {
          const weekday = document.createElement('span');
          weekday.className = 'flatpickr-weekday';
          weekday.textContent = fp.l10n.weekdays.shorthand[(index + fp.l10n.firstDayOfWeek) % 7];
          grid.append(weekday);
        }
        const { gy, gm, gd } = toGregorian(currentYear, currentMonth, 1);
        const first = new Date(gy, gm - 1, gd);
        const padding = (first.getDay() - fp.l10n.firstDayOfWeek + 7) % 7;
        for (let index = 0; index < padding; index += 1) grid.append(document.createElement('span'));
        for (let day = 1; day <= jalaaliMonthLength(currentYear, currentMonth); day += 1) {
          const date = new Date(gy, gm - 1, gd + day - 1);
          const element = document.createElement('span') as DayElement;
          element.className = 'flatpickr-day';
          element.dateObj = date;
          element.textContent = String(day);
          element.setAttribute('role', 'button');
          element.setAttribute('aria-label', new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(date));
          element.dataset.calendarDate = `${currentYear}/${String(currentMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
          element.tabIndex = fp.isEnabled(date, true) ? 0 : -1;
          element.setAttribute('aria-disabled', String(!fp.isEnabled(date, true)));
          if (!fp.isEnabled(date, true)) element.classList.add('flatpickr-disabled');
          if (date.toDateString() === new Date().toDateString()) element.classList.add('today');
          const selected = fp.selectedDates.some((value) => value.toDateString() === date.toDateString());
          if (selected) element.classList.add('selected');
          element.setAttribute('aria-pressed', String(selected));
          if (fp.config.mode === 'range' && fp.selectedDates.length === 2
              && date > fp.selectedDates[0] && date < fp.selectedDates[1]) element.classList.add('inRange');
          fp.config.onDayCreate.forEach((hook) => hook(fp.selectedDates, fp.input.value, fp, element));
          const activate = () => {
            if (!element.classList.contains('flatpickr-disabled')
                && !element.classList.contains('flatpickr-non-working-day')) select(date);
          };
          element.onclick = activate;
          element.onkeydown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
            const directions:Record<string, number> = { ArrowLeft: 1, ArrowRight: -1, ArrowDown: 7, ArrowUp: -7 };
            if (directions[event.key]) {
              event.preventDefault();
              const target = new Date(date);
              target.setDate(target.getDate() + directions[event.key]);
              jump(target);
              render();
              Array.from(root.querySelectorAll<DayElement>('.flatpickr-day'))
                .find((item) => item.dateObj.toDateString() === target.toDateString())?.focus();
            }
          };
          grid.append(element);
        }
        panel.append(grid);
        root.append(panel);
      }
    };

    return {
      disableMobile: true,
      onReady: () => {
        if (fp.config.noCalendar) return;
        root = document.createElement('div');
        root.className = 'op-persian-calendar';
        root.dir = 'rtl';
        fp.calendarContainer.classList.add('op-persian-datepicker');
        root.addEventListener('click', (event) => event.stopPropagation());
        root.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') fp.close();
          else event.stopPropagation();
        });
        fp.calendarContainer.prepend(root);
        jump(fp.selectedDates[0] || new Date());
        const redraw = fp.redraw.bind(fp);
        fp.redraw = () => { redraw(); render(); };
        const jumpToDate = fp.jumpToDate.bind(fp);
        fp.jumpToDate = (date, triggerChange) => {
          jumpToDate(date, triggerChange);
          const parsed = date ? fp.parseDate(date) : fp.selectedDates[0];
          if (parsed) jump(parsed);
          render();
        };
        render();
      },
      onValueUpdate: render,
      onChange: render,
      onOpen: () => { if (fp.selectedDates[0]) jump(fp.selectedDates[0]); render(); },
    };
  };
}
