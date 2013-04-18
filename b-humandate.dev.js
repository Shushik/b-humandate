/**
 * A wrapper for JavaScript Date object
 *
 * @page    http://github.com/Shushik/b-humandate/
 * @author  Shushik <silkleopard@yandex.ru>
 * @version 1.0
 *
 * @static
 * @constructor
 *
 * @this   {HumanDate}
 * @return {HumanDate}
 */
;function
    HumanDate(tmpl, raw) {
        return HumanDate.human(HumanDate.parse(raw), tmpl);
    }; HumanDate.prototype = {};

    /**
     * The current date
     *
     * @private
     *
     * @value {Date}
     */
    HumanDate._now = HumanDate.prototype._now = new Date();

    /**
     * The current month
     *
     * @private
     *
     * @value {number}
     */
    HumanDate._month = HumanDate.prototype._month = HumanDate._now.getMonth() + 1;

    /**
     * The current year
     *
     * @private
     *
     * @value {number}
     */
    HumanDate._year = HumanDate.prototype._year = HumanDate._now.getFullYear();

    /**
     * The current day
     *
     * @private
     *
     * @value {number}
     */
    HumanDate._day = HumanDate.prototype._day = HumanDate._now.getDate();

    /**
     * The current year prefix
     *
     * @private
     *
     * @value {string}
     */
    HumanDate._ye = HumanDate.prototype._ye = (HumanDate._year + '').substring(0, 2);

    /**
     * The common separator for joins and splits
     *
     * @private
     *
     * @value {string}
     */
    HumanDate._sep = HumanDate.prototype._sep = ';';

    /**
     * Locale settings
     *
     * @private
     *
     * @value {object}
     */
    HumanDate._locales = HumanDate.prototype._locales = {
        en : {
            ampm : {
                full  : 'ante meridiem;post meridiem',
                lower : 'am;pm',
                upper : 'AM;PM'
            },
            days : {
                plur : 'day;days;days'
            },
            years : {
                plur : 'year;years;years'
            },
            monthes : {
                decl : 'of January;of February;of March;of April;of May;of June;of July;of August;of September;of October;of November;of December',
                full : 'January;February;March;April;May;June;July;August;September;October;November;December',
                part : 'Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec',
                plur : 'month;monthes;monthes'
            },
            weekdays : {
                motu : 'Mo;Tu;We;Th;Fr;Sa;Su',
                full : 'Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday',
                part : 'Mon;Tue;Wen;Thu;Fri;Sat;Sun',
                plur : 'week;weeks;weeks'
            },
            holidays : {
                list : '',
                from : null,
                till : null
            }
        },
        def : 'en',
        curr : 'en'
    };

    /**
     * Date formats
     *
     * @private
     *
     * @value {object}
     */
    HumanDate._formats = HumanDate.prototype._formats = {
        rplc : '',
        tmpl : '',
        pregs : {
            A : '(AM|PM)',
            D : '(\\w{3})',
            F : '(\\w{3,9})',
            G : '(\\d{1,2})',
            H : '(\\d{2})',
            M : '(\\w{3})',
            N : '(\\d)',
            O : '([+-]\\d{4})',
            T : '(\\w{3})',
            W : '(\\d{2})',
            Y : '(\\d{4})',
            a : '(am|pm)',
            d : '(\\d{1,2})',
            e : '(\\w{3})',
            g : '(\\d{1,2})',
            h : '(\\d{2})',
            i : '(\\d{2})',
            j : '(\\d{1,2})',
            l : '(\\w{6,9})',
            m : '(\\d{2})',
            n : '(\\d{1,2})',
            s : '(\\d{2})',
            t : '(\\d{1,2})',
            w : '(\\d)',
            y : '(\\d{2})',
            z : '(\\d{1,3})'
        }
    };

    /**
     * A kind of calendar math
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @return {object}
     */
    HumanDate.api = HumanDate.prototype.api = function(now) {
        var
            all   = 42,
            pos   = 0,
            from  = 0,
            last  = 0,
            rest  = all,
            till  = 0,
            year  = 0,
            month = 0,
            cnow  = HumanDate.parse(now),
            data  = [];

        //
        month = cnow.getMonth();
        year  = cnow.getFullYear();
        last  = HumanDate.days(month, year);
        from  = new Date(year, month, 1).getDay();
        from  = from === 0 ? 7 : from;
        till  = last;

        rest -= last;

        //
        if (from !== 1) {
            from = -from + (7 - from);
            rest += from;
        }

        //
        if (rest > 0) {
            till = last + rest;
        }

        //
        for (pos = from; pos < till; pos++) {
            data.push(new Date(year, month, pos));
        }

        return data;
    };

    /**
     * Count the number of days in a month
     *
     * @this   {HumanDate}
     * @param  {number}
     * @return {number}
     */
    HumanDate.days = HumanDate.prototype.days = function(month, year) {
        var
            d = new Date(),
            m = month !== undefined ? month + 1 : d.getMonth() + 1,
            y = year  !== undefined ? year : d.getFullYear();

        return new Date(
            y,
            m,
            0
        ).getDate();
    };

    /**
     * Check if a year is leap
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @return {boolean}
     */
    HumanDate.leap = HumanDate.prototype.leap = function(year) {
        var
            d = new Date(),
            y = year !== undefined ? year : d.getFullYear();

        return new Date(y, 1, 29).getDate() != 1 ? true : false;
    };

    /**
     * Turn a date template into a regular expression
     *
     * @this   {HumanDate}
     * @param  {string}
     * @return {RegExp}
     */
    HumanDate.preg = HumanDate.prototype.preg = function(tmpl) {
        var
            end   = tmpl.length,
            pos   = 0,
            cp    = '',
            als   = '',
            pregs = HumanDate._formats.pregs;

        //
        for (pos = 0; pos < end; pos++) {
            als = tmpl[pos];

            if (pregs[als]) {
                cp += pregs[als]
            } else {
                cp += tmpl[pos];
            }
        }

        return new RegExp(cp, 'g');
    }

    /**
     * Get a number string with a leading zero
     *
     * @this   {HumanDate}
     * @param  {Number}
     * @return {String}
     */
    HumanDate.zero = HumanDate.prototype.zero = function(num) {
        return ("0" + num).slice(-2);
    }

    /**
     * Turn the date object into the human string
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @param  {undefined|string}
     * @param  {undefined|boolean}
     * @return {string|object}
     */
    HumanDate.human = HumanDate.prototype.human = function(raw, tmpl, part) {
        var
            tmp  = 0,
            als  = '',
            cp   = HumanDate.parse(raw),
            hmn  = {},
            dist = null,
            lang = HumanDate._locales[HumanDate._locales.curr] ?
                   HumanDate._locales[HumanDate._locales.curr] :
                   HumanDate._locales[HumanDate._locales.def];

        // Basics
        hmn.day     = cp.getDate();
        hmn.year    = cp.getFullYear();
        hmn.hours   = cp.getHours();
        hmn.month   = cp.getMonth() + 1;
        hmn.offset  = cp.getTimezoneOffset();
        hmn.minutes = cp.getMinutes();
        hmn.seconds = cp.getSeconds();

        if (part === undefined) {
            dist = HumanDate.distance(
                new Date(cp.getFullYear(), 0, 1, 0, 0, 0),
                cp
            );

            // Day
            hmn.j = hmn.day;
            hmn.d = HumanDate.zero(hmn.j);
            hmn.w = cp.getDay();
            hmn.N = hmn.w === 0 ? 7 : hmn.w;
            hmn.z = dist.days;

            // Week
            tmp = hmn.N - 1;

            hmn.D = lang.weekdays.part.split(HumanDate._sep)[tmp];
            hmn.l = lang.weekdays.full.split(HumanDate._sep)[tmp];
            hmn.W = dist.weeks;

            // Month
            tmp = hmn.month - 1;

            hmn.n = hmn.month;
            hmn.m = HumanDate.zero(hmn.n);
            hmn.M = lang.monthes.part.split(HumanDate._sep)[tmp];
            hmn.F = lang.monthes.full.split(HumanDate._sep)[tmp];
            hmn.t = HumanDate.days(hmn.month, hmn.year);

            // Year
            hmn.Y = hmn.year;
            hmn.y = (hmn.Y + '').substring(2);
            hmn.L = HumanDate.leap(hmn.Y);

            // Time
            hmn.G = hmn.hours;
            hmn.g = hmn.G + -12;
            hmn.H = HumanDate.zero(hmn.G);
            hmn.h = HumanDate.zero(hmn.g);
            hmn.i = HumanDate.zero(hmn.minutes);
            hmn.s = HumanDate.zero(hmn.seconds);

            // A.M/P.M.
            if (hmn.G <= 12) {
                hmn.a = lang.ampm.lower.split(HumanDate._sep)[0];
                hmn.A = lang.ampm.upper.split(HumanDate._sep)[0];
            } else {
                hmn.a = lang.ampm.lower.split(';')[1];
                hmn.A = lang.ampm.upper.split(';')[1];
            }

            // Timezone
            tmp = cp.toString().split('GMT')[1].replace(')', '').split(' (');

            hmn.O = tmp[0];
            hmn.P = tmp[0].substring(0, 3) + ':' + tmp[0].substring(3);
            hmn.T = tmp[1];
            hmn.Z = hmn.offset;

            // Summer time
            tmp = [
                cp.getTimezoneOffset(),
                new Date(hmn.Y, 1, 1).getTimezoneOffset(),
                new Date(hmn.Y, 7, 1).getTimezoneOffset()
            ];

            hmn.I = tmp[1] !== tmp[2] && tmp[2] === tmp[0] ? true : false;

            // UTC
            hmn.U = cp.getTime();

            // Formats
            hmn.r = cp.toString();
            hmn.c = hmn.Y + '-' + hmn.m + '-' + hmn.d + '-' +
                    'T' +
                    hmn.H + ':' + hmn.i + ':' + hmn.s + hmn.P;
        }

        if (typeof tmpl === 'string') {
            for (als in hmn) {
                tmpl = tmpl.replace(als, hmn[als]);
            }

            return tmpl;
        }

        return hmn;
    }

    /**
     * Get the minimal or the maximal date from the given list,
     * or the sorted dates list
     *
     * @this   {HumanDate}
     * @param  {array}
     * @param  {string}
     * @return {Array|Date}
     */
    HumanDate.order = HumanDate.prototype.order = function(dates, which) {
        which = which || false;
        dates = dates.sort(function(a, b) {
            if (a > b) {
                return 1;
            } else {
                return - 1;
            }
        });

        if (which == 'min') {
            return dates.shift()
        } else if (which == 'max') {
            return dates.pop();
        }

        return dates;
    };

    /**
     * Check if a Date object contains a valid date
     *
     * @this   {HumanDate}
     * @param  {Date}
     * @return {boolean}
     */
    HumanDate.valid = HumanDate.prototype.valid = function(raw) {
        if (!isNaN(raw.getDate())) {
            return true;
        }

        return false;
    }

    /**
     * Parse a date
     *
     * @this   {HumanDate}
     * @param  {number|string|date}
     * @return {Date}
     */
    HumanDate.parse = HumanDate.prototype.parse = function(raw) {
        var
            day   = 0,
            end   = 0,
            pos   = 0,
            year  = 0,
            month = 0,
            type  = typeof raw,
            cp    = null,
            now   = new Date(),
            preg  = null,
            rplcs = HumanDate._formats.rplc.split(HumanDate._sep),
            tmpls = HumanDate._formats.tmpl.split(HumanDate._sep);

        // Try to read a date with a Date parser
        if (raw instanceof Date) {
            return new Date(raw);
        } else if (type === 'number') {
            return new Date(raw);
        } else if (type === 'string') {
            cp = new Date(raw);

            //
            if (HumanDate.valid(cp)) {
                return cp;
            }

            // Try to parse the date string manually
            cp  = raw;
            end = tmpls.length;

            for (pos = 0; pos < end; pos++) {
                preg = HumanDate.preg(tmpls[pos]);

                if (cp.match(preg)) {
                    cp = cp.replace(preg, rplcs[pos]);

                    break;
                }
            }

            //
            cp = new Date(cp);

            //
            if (HumanDate.valid(cp)) {
                return cp;
            }
        }

        return HumanDate._now;
    }

    /**
     * Save a date format
     *
     * @this   {HumanDate}
     * @param  {string}
     * @param  {string}
     * @return {undefined|Array}
     */
    HumanDate.format = HumanDate.prototype.format = function(format) {
        var
            end    = format.length,
            pos    = 0,
            total  = 0,
            found  = '',
            dt     = [],
            tm     = [],
            keys   = ['year', 'month', 'day'],
            pregs  = HumanDate._formats.pregs;

        // Check the template existance
        if (HumanDate._formats.tmpl.indexOf(format) > -1) {
            return;
        }

        // Iterate through the string
        for (pos = 0; pos < end; pos++) {
            found = format[pos];

            // 
            if (pregs[found]) {
                total++;

                switch (found) {

                    case 'Y':
                        dt[0] = '$' + total;
                    break;

                    case 'y':
                        dt[0] = HumanDate._ye + '$' + total;
                    break;

                    case 'F':
                    case 'M':
                    case 'm':
                    case 'n':
                        dt[1] = '$' + total;
                    break;

                    case 'd':
                    case 'j':
                        dt[2] = '$' + total;
                    break;

                    case 'H':
                        tm[0] = '$' + total;
                    break;

                    case 'i':
                        tm[1] = '$' + total;
                    break;

                    case 's':
                        tm[2] = '$' + total;
                    break;

                }
            }
        }

        //
        for (pos = 0; pos < 3; pos++) {
            if (dt[pos] === undefined) {
                dt[pos] = HumanDate['_' + keys[pos]];
            }

            if (tm[pos] === undefined) {
                tm[pos] = '00';
            }
        }

        // Save the values
        HumanDate._formats.tmpl = format + HumanDate._sep + HumanDate._formats.tmpl;
        HumanDate._formats.rplc = (dt.join(' ') + ' ' + tm.join(':')) + HumanDate._sep + HumanDate._formats.rplc;
    }

    /**
     * Check if the day is holiday
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @return {boolean}
     */
    HumanDate.holiday = HumanDate.prototype.holiday = function(raw) {
        var
            lang     = HumanDate._locales.curr,
            hayfork  = '',
            haystack = '',
            cp       = HumanDate.parse(raw);

        // Get a date string
        hayfork  = cp.getFullYear() + '-' +
                   HumanDate.zero(cp.getMonth() + 1) + '-' +
                   HumanDate.zero(cp.getDate());

        // Get a holidays list
        haystack = HumanDate._locales[lang] && HumanDate._locales[lang].holidays ?
                   HumanDate._locales[lang].holidays.list :
                   HumanDate._locales[HumanDate._locales.def].holidays.list;

        //
        if (haystack.indexOf(hayfork) > -1) {
            return true;
        }

        return HumanDate.weekend(raw);
    };

    /**
     * Check if the given date is between the minimal and maximal
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @param  {number|string|Date}
     * @param  {number|string|Date}
     * @return {boolean}
     */
    HumanDate.inside = HumanDate.prototype.inside = function(now, min, max) {
        var
            cmax = HumanDate.parse(max),
            cmin = HumanDate.parse(min),
            cnow = HumanDate.parse(now);

        if (cnow > cmin && cnow < cmax) {
            return true;
        }

        return false;
    };

    /**
     * Check if the day is weekend
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @return {boolean}
     */
    HumanDate.weekend = HumanDate.prototype.weekend = function(raw) {
        var
            day = 0,
            cp  = HumanDate.parse(raw);

        day = cp.getDay();

        if (day == 0 || day == 6) {
            return true;
        }

        return false;
    };

    /**
     * Get the distance between the dates
     *
     * @this   {HumanDate}
     * @param  {number|string|Date}
     * @param  {number|string|Date}
     * @return {object}
     */
    HumanDate.distance = HumanDate.prototype.distance = function(from, till) {
        var
            tmp   = 0,
            out   = {
                days    : 0,
                hours   : 0,
                weeks   : 0,
                years   : 0,
                seconds : 0,
                minutes : 0,
                monthes : 0
            },
            cfrom = HumanDate.parse(from),
            ctill = HumanDate.parse(till);

        // Just in case of crazy coder
        if (cfrom > ctill) {
            tmp  = ctill;
            ctill = cfrom;
            cfrom = tmp;
        }

        // Get the raw number of passed years between the dates
        tmp = (ctill.getFullYear() - cfrom.getFullYear()) * 12;

        // Get the number of monthes and years
        out.monthes = (tmp - cfrom.getMonth()) + ctill.getMonth();
        out.years   = Math.floor(out.monthes / 12);

        // Get the raw number of milliseconds between the dates
        tmp = ctill.getTime() - cfrom.getTime();

        // Get the seconds, minutes and hours
        out.seconds = Math.floor(tmp / 1000);
        out.minutes = Math.floor(out.seconds / 60);
        out.hours   = Math.floor(out.minutes / 60);

        // Get the days and weeks
        out.days  = Math.floor(out.hours / 24);
        out.weeks = Math.floor(out.days / 7);

        return out;
    };

    /**
     * Set the holidays
     *
     * @this   {Cal}
     * @param  {string}
     * @param  {undefined|string|Array}
     * @return {undefined|Array}
     */
    HumanDate.holidays = HumanDate.prototype.holidays = function(lang, items) {
        var
            end   = 0,
            pos   = 0,
            from  = '',
            till  = '',
            alias = '';

        if (items !== undefined) {
            //
            if (!HumanDate._locales[lang]) {
                HumanDate.language(lang);
            }

            //
            HumanDate._locales[lang].holidays = {
                list : '',
                from : null,
                till : null
            };

            //
            if (items instanceof Array) {
                HumanDate._locales[lang].holidays.list = items.join(HumanDate._sep);
            } else if (typeof items === 'string') {
                HumanDate._locales[lang].holidays.list = items;
            }
        } else {
            if (HumanDate._locales[lang] && HumanDate._locales[lang].holidays) {
                return HumanDate._locales[lang].holidays.split(HumanDate._sep);
            } else {
                return null;
            }
        }
        
    }

    /**
     * Set the language settings
     *
     * @this   {Cal}
     * @param  {string}
     * @param  {object}
     * @return {undefined}
     */
    HumanDate.language = HumanDate.prototype.language = function(lang, items) {
        var
            als  = '',
            sals = '',
            def  = HumanDate._locales[HumanDate._locales.def];

        // Create the parent object if not exists
        if (!HumanDate._locales[lang]) {
            HumanDate._locales[lang] = {};
        }

        //
        for (als in def) {
            HumanDate._locales[lang][als] = {};

            //
            for (sals in def[als]) {
                if (items && items[als] && items[als][sals]) {
                    if (items[als][sals] instanceof Array) {
                        HumanDate._locales[lang][als][sals] = items[als][sals].join(HumanDate._sep);
                    } else {
                        HumanDate._locales[lang][als][sals] = items[als][sals];
                    }
                } else {
                    HumanDate._locales[lang][als][sals] = def[als][sals];
                }
            }
        }
    }

/**
 * Prefill the default formats
 */
;(function() {
    var
        pos = 0,
        arr = 'D M d Y H:i:s eO \(T\);D M d Y H:i:s eO;D M d H:i:s e Y;Y-m-d H:i:s;H:i:s;Y-m-d;y-m-d;M d,Y;Y-M-d;y-M-d;d-M-Y;M/d/y;m-d-Y;m.d.Y;d/m/Y;d-m-Y;d.m.Y;M d, Y;M d;M-d;m/d;m-d;d-M;d/m;d-m;d'.split(HumanDate._sep);

    for (pos in arr) {
        HumanDate.format(arr[pos]);
    }
})();