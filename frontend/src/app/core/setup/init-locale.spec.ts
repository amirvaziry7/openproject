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

import moment from 'moment';
import {
  afterEach, describe, expect, it,
} from 'vitest';
import './init-moment-locales';
import { initializeLocale } from './init-locale';

describe('initializeLocale', () => {
  const loadLocale = () => Promise.resolve({ default: {} });

  afterEach(() => {
    document.querySelector('meta[name="openproject_initializer"]')?.remove();
    moment.locale('en');
  });

  function setInitializer(locale:string) {
    const meta = document.createElement('meta');
    meta.name = 'openproject_initializer';
    meta.dataset.locale = locale;
    meta.dataset.defaultlocale = 'en';
    meta.dataset.instancelocale = locale;
    document.head.appendChild(meta);
  }

  it('uses the German week numbering rules', async () => {
    setInitializer('de');

    await initializeLocale(loadLocale);

    expect(moment('2020-12-31').format('ww')).toBe('53');
    expect(moment('2021-01-01').format('ww')).toBe('53');
    expect(moment('2021-01-04').format('ww')).toBe('01');
  });

  it('uses the English week numbering rules', async () => {
    setInitializer('en');

    await initializeLocale(loadLocale);

    expect(moment('2020-12-31').format('ww')).toBe('01');
    expect(moment('2021-01-01').format('ww')).toBe('01');
    expect(moment('2021-01-04').format('ww')).toBe('02');
  });

  it('loads Persian translations and preserves numeric date formatting', async () => {
    setInitializer('fa');

    await initializeLocale(() => Promise.resolve({
      default: { fa: { js: { label_project_plural: 'پروژه‌ها' } } },
    }));

    expect(window.I18n.locale).toBe('fa');
    expect(window.I18n.t('js.label_project_plural')).toBe('پروژه‌ها');
    expect(moment('2026-10-14').format('YYYY-MM-DD')).toBe('2026-10-14');
  });

  it('keeps English active when the instance language is Persian', async () => {
    setInitializer('en');
    const meta = document.querySelector<HTMLMetaElement>('meta[name="openproject_initializer"]');
    meta!.dataset.instancelocale = 'fa';
    const loadedLocales:string[] = [];

    await initializeLocale((locale:string) => {
      loadedLocales.push(locale);
      return Promise.resolve({
        default: {
          en: { js: { label_project_plural: 'Projects' } },
          fa: { js: { label_project_plural: 'پروژه‌ها' } },
        },
      });
    });

    expect(loadedLocales).toEqual(['en', 'fa']);
    expect(window.I18n.locale).toBe('en');
    expect(window.I18n.t('js.label_project_plural')).toBe('Projects');
  });
});
