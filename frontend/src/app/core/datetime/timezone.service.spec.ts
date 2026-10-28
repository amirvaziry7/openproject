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

import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { PathHelperService } from 'core-app/core/path-helper/path-helper.service';
import { I18nService } from 'core-app/core/i18n/i18n.service';
import { ConfigurationService } from 'core-app/core/config/configuration.service';
import { TimezoneService } from 'core-app/core/datetime/timezone.service';
import moment from 'moment-timezone';

describe('TimezoneService', () => {
  const TIME = '2013-02-08T09:30:26';
  const DATE = '2013-02-08';
  let timezoneService:TimezoneService;

  const compile = (timezone?:string, formats:{ date?:string, time?:string } = {}, locale = 'en') => {
    const ConfigurationServiceStub = {
      isTimezoneSet: () => !!timezone,
      timezone: () => timezone,
      dateFormatPresent: () => !!formats.date,
      dateFormat: () => formats.date,
      timeFormatPresent: () => !!formats.time,
      timeFormat: () => formats.time,
    };

    if (!timezone) {
      vi.spyOn(moment.tz, 'guess').mockReturnValue('Etc/UTC');
    }

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: I18nService, useValue: { locale } },
        { provide: ConfigurationService, useValue: ConfigurationServiceStub },
        PathHelperService,
        TimezoneService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
      ],
    });

    timezoneService = TestBed.inject(TimezoneService);
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('without time zone set', () => {
    beforeEach(() => {
      compile();
    });

    describe('#parseDatetime', () => {
      it('is UTC', () => {
        const time = timezoneService.parseDatetime(TIME);

        expect(time.utcOffset()).toEqual(0);
        expect(time.format('HH:mm')).toEqual('09:30');
      });

      it('has no time information', () => {
        const time = timezoneService.parseDate(DATE);

        expect(time.format('HH:mm')).toEqual('00:00');
      });
    });
  });

  describe('with time zone set', () => {
    beforeEach(() => {
      compile('America/Vancouver');
    });

    describe('Non-UTC timezone', () => {
      it('is in the given timezone', () => {
        const date = timezoneService.parseDatetime(TIME);

        expect(date.format('HH:mm')).toEqual('01:30');
      });

      it('has local time zone', () => {
        expect(timezoneService.configurationService.timezone()).toEqual('America/Vancouver');
      });
    });
  });

  describe('#parseFormattedDatetime', () => {
    beforeEach(() => {
      compile('Europe/Berlin', { date: 'DD.MM.YYYY', time: 'HH:mm' });
    });

    it('parses the user format in the user time zone and returns UTC', () => {
      expect(timezoneService.parseFormattedDatetime('01.10.2026 14:30')).toEqual('2026-10-01T12:30:00Z');
    });

    it('returns null for text not matching the user format', () => {
      expect(timezoneService.parseFormattedDatetime('2026-10-01 14:30')).toBeNull();
    });
  });

  describe('#uses24HourClock', () => {
    it('is true for a 24 hour time format', () => {
      compile('Europe/Berlin', { time: 'HH:mm' });

      expect(timezoneService.uses24HourClock()).toBe(true);
    });

    it('is false for a time format with a meridiem', () => {
      compile('Europe/Berlin', { time: 'hh:mm a' });

      expect(timezoneService.uses24HourClock()).toBe(false);
    });

    it('expands the locale time format when none is configured', () => {
      compile('Europe/Berlin');

      expect(timezoneService.uses24HourClock()).toBe(!/[aA]/.test(moment.localeData().longDateFormat('LT')));
    });
  });

  describe('Persian dates in the user time zone', () => {
    beforeEach(() => compile('Asia/Tehran', { date: 'YYYY/MM/DD', time: 'HH:mm' }, 'fa'));

    it('converts the local day after applying the time zone', () => {
      expect(timezoneService.formattedDatetime('2025-03-20T21:00:00Z')).toBe('1404/01/01 00:30');
      expect(timezoneService.formattedDatetime('2025-03-20T20:00:00Z')).toBe('1403/12/30 23:30');
    });

    it('round-trips a Persian datetime to the same Gregorian instant', () => {
      expect(timezoneService.parseFormattedDatetime('۱۴۰۴/۰۱/۰۱ ۰۰:۳۰')).toBe('2025-03-20T21:00:00Z');
      expect(timezoneService.parseFormattedDatetime('1404/12/30 00:30')).toBeNull();
    });

    it('keeps canonical date parsing, validation and output Gregorian', () => {
      expect(timezoneService.formattedDate('2026-10-27')).toBe('1405/08/05');
      expect(timezoneService.formattedISODate('2026-10-27')).toBe('2026-10-27');
      expect(timezoneService.isValidISODate('2026-02-30')).toBe(false);
      expect(timezoneService.parseISODate('2026-10-27').year()).toBe(2026);
    });
  });
});
