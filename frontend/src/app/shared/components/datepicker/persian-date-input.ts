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
import { formatCalendarDate, parsePersianDate } from 'core-app/core/datetime/persian-calendar';

export function localizePersianDateInput(input:HTMLInputElement):() => void {
  const visible = input.cloneNode(false) as HTMLInputElement;
  const originalType = input.type;
  const focused = document.activeElement === input;
  visible.type = 'text';
  visible.id = `${input.id}-display`;
  visible.removeAttribute('name');
  Array.from(visible.attributes).forEach((attribute) => {
    if (attribute.name.startsWith('data-')) visible.removeAttribute(attribute.name);
  });
  visible.placeholder = 'YYYY/MM/DD';
  visible.dir = 'ltr';
  const labels = Array.from(input.labels ?? []);
  labels.forEach((label) => { label.htmlFor = visible.id; });
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!;
  const update = () => {
    const value = descriptor.get!.call(input) as string;
    visible.value = value ? formatCalendarDate(moment(value), 'YYYY/MM/DD', 'fa') : '';
  };
  Object.defineProperty(input, 'value', {
    configurable: true,
    get: () => descriptor.get!.call(input) as string,
    set: (value:string) => { descriptor.set!.call(input, value); update(); },
  });
  visible.addEventListener('input', () => {
    const parsed = parsePersianDate(visible.value, 'YYYY/MM/DD');
    visible.setCustomValidity(visible.value && !parsed ? window.I18n.t('js.persian_calendar.invalid_date') : '');
    if (visible.value && !parsed) return;
    descriptor.set!.call(input, parsed?.date ?? '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  visible.addEventListener('focus', () => input.dispatchEvent(new FocusEvent('focus')));
  const observer = new MutationObserver(() => {
    visible.className = input.className;
    visible.disabled = input.disabled;
    visible.readOnly = input.readOnly;
  });
  observer.observe(input, { attributes: true, attributeFilter: ['class', 'disabled', 'readonly'] });
  input.type = 'hidden';
  input.after(visible);
  update();
  if (focused || input.dataset.focus === 'true') visible.focus();
  return () => {
    observer.disconnect();
    Reflect.deleteProperty(input, 'value');
    input.type = originalType;
    labels.forEach((label) => { label.htmlFor = input.id; });
    visible.remove();
  };
}

export function observePersianDateInputs(root:Element, ids:string[]):() => void {
  const inputs = new Map<string, { input:HTMLInputElement; destroy:() => void }>();
  const refresh = () => {
    ids.forEach((id) => {
      const input = document.getElementById(id) as HTMLInputElement|null;
      const previous = inputs.get(id);
      if (previous?.input === input && input?.type === 'hidden'
          && document.getElementById(`${id}-display`)) return;

      previous?.destroy();
      inputs.delete(id);
      if (input && root.contains(input)) {
        inputs.set(id, { input, destroy: localizePersianDateInput(input) });
      }
    });
  };
  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['type'] });
  return () => {
    observer.disconnect();
    inputs.forEach(({ destroy }) => destroy());
    inputs.clear();
  };
}
