# frozen_string_literal: true

module OpenProject
  module Internationalization
    module PersianCalendar
      # Borkowski year boundaries, as implemented by jalaali-js (MIT).
      # See doc/licenses/jalaali-js.txt for attribution and license.
      BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
                1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178].freeze
      MONTHS = %w[فروردین اردیبهشت خرداد تیر مرداد شهریور مهر آبان آذر دی بهمن اسفند].freeze

      module_function

      def year_start(year) # rubocop:disable Metrics/AbcSize
        raise ArgumentError, "Unsupported Persian year" unless (-61..3177).cover?(year)

        previous = BREAKS.first
        leap_days = -14
        jump = 0
        BREAKS.drop(1).each do |boundary|
          jump = boundary - previous
          break if year < boundary

          leap_days += (jump.div(33) * 8) + (jump % 33).div(4)
          previous = boundary
        end
        offset = year - previous
        leap_days += (offset.div(33) * 8) + ((offset % 33) + 3).div(4)
        leap_days += 1 if jump % 33 == 4 && jump - offset == 4
        gregorian_year = year + 621
        gregorian_leaps = gregorian_year.div(4) - ((gregorian_year.div(100) + 1) * 3).div(4) - 150
        ::Date.new(gregorian_year, 3, 20 + leap_days - gregorian_leaps, ::Date::GREGORIAN)
      end

      def parts(date)
        year = [date.year - 621, 3177].min
        first = year_start(year)
        if date < first
          year -= 1
          first = year_start(year)
        end
        offset = (date.to_date - first).to_i
        month, day = offset < 186 ? offset.divmod(31) : (offset - 186).divmod(30)
        [year, month + (offset < 186 ? 1 : 7), day + 1, offset + 1]
      end

      def localize(date, format: :default)
        format = ::I18n.t("date.formats.#{format}") if format.is_a?(Symbol)
        values = directive_values(date)
        localized_format = format.gsub(/%%|%([-_0]?)([YyCmBbhdejFDx])/) do |token|
          next token if token == "%%"

          flag, directive = Regexp.last_match.captures
          value = directive == "x" ? localize(date) : values.fetch(directive)
          flag == "-" ? value.sub(/\A[ 0]+(?=\d)/, "") : value
        end
        ::I18n.l(date, format: localized_format)
      rescue ArgumentError
        ::I18n.l(date, format:)
      end

      def directive_values(date) # rubocop:disable Metrics/AbcSize
        year, month, day, year_day = parts(date)
        { "Y" => year.to_s.rjust(4, "0"), "y" => (year % 100).to_s.rjust(2, "0"),
          "C" => year.div(100).to_s, "m" => month.to_s.rjust(2, "0"),
          "B" => MONTHS[month - 1], "b" => MONTHS[month - 1], "h" => MONTHS[month - 1],
          "d" => day.to_s.rjust(2, "0"), "e" => day.to_s.rjust(2),
          "j" => year_day.to_s.rjust(3, "0"),
          "F" => "%<year>04d-%<month>02d-%<day>02d" % { year:, month:, day: },
          "D" => "%<month>02d/%<day>02d/%<year>02d" % { month:, day:, year: year % 100 } }
      end
    end
  end
end
