# frozen_string_literal: true

# -- copyright
# OpenProject is an open source project management software.
# Copyright (C) the OpenProject GmbH
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2013 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See COPYRIGHT and LICENSE files for more details.
# ++

module My
  module WorkHelper
    include Redmine::I18n

    def week_date_range(date)
      date_range(week_days(date).first, week_days(date).last)
    end

    # The work week leaves out the days that are not worked, so it is the range it covers
    # rather than the week around it that names it.
    def workweek_date_range(date)
      date_range(workweek_days(date).first, workweek_days(date).last)
    end

    def week_days(date)
      date.all_week(OpenProject::Internationalization::Date.beginning_of_week)
    end

    def workweek_days(date)
      worked = Setting.working_days.map { |day| day % 7 }

      week_days(date).select { |day| worked.include?(day.wday) }
    end

    # A month is listed by week, so its sections stand for the week starting on their date.
    def list_section_dates(date, mode)
      mode.to_sym == :month ? date..(date + 6.days) : date..date
    end

    def date_range(from, to)
      from_format, to_format = date_range_formats(from, to)
      [format_calendar_date(from, format: from_format), format_calendar_date(to, format: to_format)].join(" - ")
    end

    def date_range_formats(from, to)
      return %i[long long] if I18n.locale == :fa

      if from.year == to.year && from.month == to.month
        ["%d.", "%d. %B %Y"]
      elsif from.year == to.year
        ["%d. %B", "%d. %B %Y"]
      else
        ["%d. %B %Y", "%d. %B %Y"]
      end
    end
  end
end
