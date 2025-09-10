import { addDaysToDate, addHoursToDate, addMonthsToDate, addMonthToDate, addWeeksToDate, addYearsToDate, APRIL_MONTH_INDEX, AUGUST_MONTH_INDEX, countDaysBetweenDates, countDaysInRangeOfMonthsFromStartDate, countDaysInRangeOfYears, countYearsBetweenDates, DAYS_IN_APRIL, DAYS_IN_AUGUST, DAYS_IN_DECEMBER, DAYS_IN_FEBRUARY_LEAP_YEAR, DAYS_IN_FEBRUARY_NON_LEAP_YEAR, DAYS_IN_JANUARY, DAYS_IN_JULY, DAYS_IN_JUNE, DAYS_IN_MARCH, DAYS_IN_MAY, DAYS_IN_NOVEMBER, DAYS_IN_OCTOBER, DAYS_IN_SEPTEMBER, DECEMBER_MONTH_INDEX, FEBRUARY_MONTH_INDEX, getDaysInMonth, getDaysInYear, isDateAfterOtherDate, isDateBeforeOtherDate, isLeapYear, isValidDate, JANUARY_MONTH_INDEX, JULY_MONTH_INDEX, JUNE_MONTH_INDEX, MARCH_MONTH_INDEX, MAY_MONTH_INDEX, NOVEMBER_MONTH_INDEX, OCTOBER_MONTH_INDEX, SEPTEMBER_MONTH_INDEX } from "../src/dates";

describe('isLeapYear', () => {
    it('returns true for a leap year.', () => {
        const leapYear: number = 2024;
        expect(isLeapYear(leapYear)).toEqual(true);
    });
    it('returns false for a non-leap year.', () => {
        const nonLeapYear: number = 2025;
        expect(isLeapYear(nonLeapYear)).toEqual(false);
    });
});

describe('getDaysInMonth', () => {
    it('returns 31 for january regardless of leap year.', () => {
        let days: number = getDaysInMonth(JANUARY_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_JANUARY);
        days = getDaysInMonth(JANUARY_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_JANUARY);
    });
    it('returns 28 for february for a non-leap year.', () => {
        const days: number = getDaysInMonth(FEBRUARY_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_FEBRUARY_NON_LEAP_YEAR);
    });
    it('returns 29 for february for a leap year.', () => {
        const days: number = getDaysInMonth(FEBRUARY_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_FEBRUARY_LEAP_YEAR);
    });
    it('returns 31 for march regardless of leap year.', () => {
        let days: number = getDaysInMonth(MARCH_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_MARCH);
        days = getDaysInMonth(MARCH_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_MARCH);
    });
    it('returns 30 for april regardless of leap year.', () => {
        let days: number = getDaysInMonth(APRIL_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_APRIL);
        days = getDaysInMonth(APRIL_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_APRIL);
    });
    it('returns 31 for may regardless of leap year.', () => {
        let days: number = getDaysInMonth(MAY_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_MAY);
        days = getDaysInMonth(MAY_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_MAY);
    });
    it('returns 30 for june regardless of leap year.', () => {
        let days: number = getDaysInMonth(JUNE_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_JUNE);
        days = getDaysInMonth(JUNE_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_JUNE);
    });
    it('returns 31 for july regardless of leap year.', () => {
        let days: number = getDaysInMonth(JULY_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_JULY);
        days = getDaysInMonth(JULY_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_JULY);
    });
    it('returns 31 for august regardless of leap year.', () => {
        let days: number = getDaysInMonth(AUGUST_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_AUGUST);
        days = getDaysInMonth(AUGUST_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_AUGUST);
    });
    it('returns 30 for september regardless of leap year.', () => {
        let days: number = getDaysInMonth(SEPTEMBER_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_SEPTEMBER);
        days = getDaysInMonth(SEPTEMBER_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_SEPTEMBER);
    });
    it('returns 31 for october regardless of leap year.', () => {
        let days: number = getDaysInMonth(OCTOBER_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_OCTOBER);
        days = getDaysInMonth(OCTOBER_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_OCTOBER);
    });
    it('returns 30 for november regardless of leap year.', () => {
        let days: number = getDaysInMonth(NOVEMBER_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_NOVEMBER);
        days = getDaysInMonth(NOVEMBER_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_NOVEMBER);
    });
    it('returns 31 for december regardless of leap year.', () => {
        let days: number = getDaysInMonth(DECEMBER_MONTH_INDEX, true);
        expect(days).toEqual(DAYS_IN_DECEMBER);
        days = getDaysInMonth(DECEMBER_MONTH_INDEX, false);
        expect(days).toEqual(DAYS_IN_DECEMBER);
    });
    it('throws for a mont index outside of range.', () => {
        let invalidMonthIndex: number = 12;
        expect(() => getDaysInMonth(invalidMonthIndex, true)).toThrow(RangeError);
        invalidMonthIndex = -1000;
        expect(() => getDaysInMonth(invalidMonthIndex, true)).toThrow(RangeError);
    });
});

describe('addMonthToDate', () => {
    it('returns a date one month in the future for the same year.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const expectedFutureDate: Date = new Date(2001, OCTOBER_MONTH_INDEX, 11);
        const addedDate: Date = addMonthToDate(referenceDate);
        expect(addedDate).toBeDefined();
        expect(addedDate).toBeInstanceOf(Date);
        expect(addedDate.toString().toLowerCase()).not.toEqual('invalid date');
        expect(isNaN(addedDate.valueOf())).toEqual(false);
        expect(addedDate.getUTCFullYear()).toEqual(expectedFutureDate.getUTCFullYear());
        expect(addedDate.getUTCMonth()).toEqual(expectedFutureDate.getUTCMonth());
        expect(addedDate.getUTCDate()).toEqual(expectedFutureDate.getUTCDate());
    });
    it('returns a january following a december for the previous year.', () => {
        const referenceDate: Date = new Date(1941, DECEMBER_MONTH_INDEX, 7);
        const expectedFutureDate: Date = new Date(1942, JANUARY_MONTH_INDEX, 7);
        const addedDate: Date = addMonthToDate(referenceDate);
        expect(addedDate).toBeDefined();
        expect(addedDate).toBeInstanceOf(Date);
        expect(addedDate.toString().toLowerCase()).not.toEqual('invalid date');
        expect(isNaN(addedDate.valueOf())).toEqual(false);
        expect(addedDate.getUTCFullYear()).toEqual(expectedFutureDate.getUTCFullYear());
        expect(addedDate.getUTCMonth()).toEqual(expectedFutureDate.getUTCMonth());
        expect(addedDate.getUTCDate()).toEqual(expectedFutureDate.getUTCDate());
    });
});

describe('countDaysInRangeOfMonthsFromStartDate', () => {
    it('returns the number of days between adjacent months of the same non-leap year.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const monthCount: number = 2;
        const expectedCount: number = getDaysInMonth(SEPTEMBER_MONTH_INDEX, false) + getDaysInMonth(OCTOBER_MONTH_INDEX, false);
        const count: number = countDaysInRangeOfMonthsFromStartDate(startDate, monthCount);
        expect(count).toEqual(expectedCount);
    });
    it('returns the number of days for a one month range.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const monthCount: number = 1;
        const expectedCount: number = getDaysInMonth(SEPTEMBER_MONTH_INDEX, false);
        const count: number = countDaysInRangeOfMonthsFromStartDate(startDate, monthCount);
        expect(count).toEqual(expectedCount);
    });
    it('returns the number of days across 6 months within the same non-leap year.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const monthCount: number = 4;
        const expectedCount: number = getDaysInMonth(SEPTEMBER_MONTH_INDEX, false) 
            + getDaysInMonth(OCTOBER_MONTH_INDEX, false) 
            + getDaysInMonth(NOVEMBER_MONTH_INDEX, false) 
            + getDaysInMonth(DECEMBER_MONTH_INDEX, false);
        const count: number = countDaysInRangeOfMonthsFromStartDate(startDate, monthCount);
        expect(count).toEqual(expectedCount);
    });
    it('returns the number of days from a non-leap year into March of a leap-year.', () => {
        const startDate: Date = new Date(2023, DECEMBER_MONTH_INDEX, 7);
        const monthCount: number = 4;
        const expectedCount: number = getDaysInMonth(DECEMBER_MONTH_INDEX, false)
            + getDaysInMonth(JANUARY_MONTH_INDEX, true)
            + getDaysInMonth(FEBRUARY_MONTH_INDEX, true)
            + getDaysInMonth(MARCH_MONTH_INDEX, true);
        const count: number = countDaysInRangeOfMonthsFromStartDate(startDate, monthCount);
        expect(count).toEqual(expectedCount);
    });
});

describe('isDateBeforeOtherDate', () => {
    it('returns true for a date that is before another one.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const otherDate: Date = new Date(2001, OCTOBER_MONTH_INDEX, 31);
        expect(isDateBeforeOtherDate(referenceDate, otherDate)).toEqual(true);
    });
    it('returns true for a date one millisecond before another one.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 0);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 1);
        expect(isDateBeforeOtherDate(referenceDate, otherDate)).toEqual(true);
    });
    it('returns false for a date that is after another one.', () => {
        const referenceDate: Date = new Date(2021, SEPTEMBER_MONTH_INDEX, 11, 9, 3, 0, 0);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 0);
        expect(isDateBeforeOtherDate(referenceDate, otherDate)).toEqual(false);
    });
    it('returns false for a date that is one millisecond after another one.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 1);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 0);
        expect(isDateBeforeOtherDate(referenceDate, otherDate)).toEqual(false);
    });
});

describe('isDateAfterOtherDate', () => {
    it('returns true for a date after another date.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const otherDate: Date = new Date(1941, DECEMBER_MONTH_INDEX, 7);
        expect(isDateAfterOtherDate(referenceDate, otherDate)).toEqual(true);
    });
    it('returns true for a date one millisecond after another one.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 0);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 45, 0, 999);
        expect(isDateAfterOtherDate(referenceDate, otherDate)).toEqual(true);
    });
    it('returns false for a date before another date.', () => {
        const referenceDate: Date = new Date(1941, DECEMBER_MONTH_INDEX, 7);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        expect(isDateAfterOtherDate(referenceDate, otherDate)).toEqual(false);
    });
    it('returns false for a date one millisecond before another date.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 45, 59, 999);
        const otherDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46);
        expect(isDateAfterOtherDate(referenceDate, otherDate)).toEqual(false);
    });
});

describe('isValidDate', () => {
    it('returns true for a valid date.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        expect(isValidDate(referenceDate)).toEqual(true);
    });
    it('returns false for an invalid date.', () => {
        const referenceDate: Date = new Date('911WasanInsideJob!');
        expect(isValidDate(referenceDate)).toEqual(false);
    });
});

describe('countDaysBetweenDates', () => {
    it('returns the correct number of days between two dates in the same non-leap year.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2001, DECEMBER_MONTH_INDEX, 31);
        const expectedDayCount: number = DAYS_IN_DECEMBER + DAYS_IN_NOVEMBER + DAYS_IN_OCTOBER + (DAYS_IN_SEPTEMBER - 11);
        const count: number = countDaysBetweenDates(startDate, endDate);
        expect(count).toEqual(expectedDayCount);
    });
    it('returns the correct number of days between two dates in the same non-leap year; order reversed.', () => {
        const startDate: Date = new Date(2001, DECEMBER_MONTH_INDEX, 31);
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const expectedDayCount: number = (DAYS_IN_SEPTEMBER - 11) + DAYS_IN_OCTOBER + DAYS_IN_NOVEMBER + DAYS_IN_DECEMBER;
        const count: number = countDaysBetweenDates(startDate, endDate);
        expect(count).toEqual(expectedDayCount);
    });
    it('returns the correct number of days bettwen two dates across two non-leap years.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2002, SEPTEMBER_MONTH_INDEX, 10);
        const expectedDayCount: number = 364;
        const count: number = countDaysBetweenDates(startDate, endDate);
        expect(count).toEqual(expectedDayCount);
    });
    it('returns zero for the same date.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46);
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46);
        expect(countDaysBetweenDates(startDate, endDate)).toEqual(0);
    });
    it('throws a TypeError with an invalid start date.', () => {
        const startDate: Date = new Date('building 7, yo');
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46);
        expect(() => countDaysBetweenDates(startDate, endDate)).toThrow(TypeError);
    });
    it('throws a TypeError with an in invalid end date.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46);
        const endDate: Date = new Date('building 7, yo');
        expect(() => countDaysBetweenDates(startDate, endDate)).toThrow(TypeError);
    });
});

describe('getDaysInYear', () => {
    it('returns 365 days for a non-leap year.', () => {
        const year: number = 2001;
        const expectedDays: number = 365;
        const count: number = getDaysInYear(year);
        expect(count).toEqual(expectedDays);
    });  
    it('returns 366 days for a leap year.', () => {
        const year: number = 2004;
        const expectedDays: number = 366;
        const count: number = getDaysInYear(year);
        expect(count).toEqual(expectedDays);
    });
});

describe('countYearsBetweenDates', () => {
    it('returns the correct number of years between two range.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2021, SEPTEMBER_MONTH_INDEX, 11);
        const expectedYears: number = 20;
        const yearCount: number = countYearsBetweenDates(startDate, endDate);
        expect(yearCount).toEqual(expectedYears);
    });
    it('returns the correct number of years between two range; reversed order.', () => {
        const startDate: Date = new Date(2021, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const expectedYears: number = 20;
        const yearCount: number = countYearsBetweenDates(startDate, endDate);
        expect(yearCount).toEqual(expectedYears);
    });
    it('returns zero for the same year.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2001, DECEMBER_MONTH_INDEX, 31);
        const expectedYears: number = 0;
        const yearCount: number = countYearsBetweenDates(startDate, endDate);
        expect(yearCount).toEqual(expectedYears);
    });
    it('returns zero for the same dates.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const expectedYear: number = 0;
        const yearCount: number = countYearsBetweenDates(startDate, endDate);
        expect(yearCount).toEqual(0);
    });
    it('throws a TypeError for an invalid start date.', () => {
        const startDate: Date = new Date('skdfnoisanfolsk');
        const endDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        expect(() => countYearsBetweenDates(startDate, endDate)).toThrow(TypeError);
    });
    it('throws a TypeError for an invalid end date.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const endDate: Date = new Date('ksndfosnf');
        expect(() => countYearsBetweenDates(startDate, endDate)).toThrow(TypeError);
    });
});

describe('countDaysInRangeOfYears', () => {
    it('returns the number of days in 3 non-leap years.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const yearCount: number = 3;
        const expectedDayCount: number = 3 * 365;
        const dayCount: number = countDaysInRangeOfYears(startDate, yearCount);
        expect(dayCount).toEqual(expectedDayCount);
    });
    it('returns the number of days in 4 years; including leap year.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const yearCount: number = 4;
        const expectedDayCount: number = (3 * 365) + 366;
        const dayCount: number = countDaysInRangeOfYears(startDate, yearCount);
        expect(dayCount).toEqual(expectedDayCount);
    });
    it('returns the number of days across 20 years that include 5 leap years.', () => {
        const startDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const yearCount: number = 20;
        const expectedDayCount: number = (15 * 365) + (5 * 366); 
        const dayCount: number = countDaysInRangeOfYears(startDate, yearCount);
        expect(dayCount).toEqual(expectedDayCount);
    });
});

describe('addDaysToDate', () => {
    it('returns a new date n days in the future within the same month of a non-leap year.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const dayCount: number = 10;
        const expectedDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 21);
        const newDate: Date = addDaysToDate(referenceDate, dayCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date n-days in the future accounting for leap year.', () => {
        const referenceDate: Date = new Date(2004, FEBRUARY_MONTH_INDEX, 14);
        const dayCount: number = 15;
        const expectedDate: Date = new Date(2004, FEBRUARY_MONTH_INDEX, 29);
        const newDate: Date = addDaysToDate(referenceDate, dayCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date one year and a day in the future across non-leap year.', () => {
        const referenceDate: Date = new Date(2003, FEBRUARY_MONTH_INDEX, 14);
        const dayCount: number = 366;
        const expectedDate: Date = new Date(2004, FEBRUARY_MONTH_INDEX, 15);
        const newDate: Date = addDaysToDate(referenceDate, dayCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date one year and a day in the future across a leap year.', () => {
        const referenceDate: Date = new Date(2004, FEBRUARY_MONTH_INDEX, 14);
        const dayCount: number = 367;
        const expectedDate: Date = new Date(2005, FEBRUARY_MONTH_INDEX, 15);
        const newDate: Date = addDaysToDate(referenceDate, dayCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('throws a type error with an invalid date.', () => {
        const referenceDate: Date = new Date('jkb jkb kj ');
        expect(() => addDaysToDate(referenceDate, 10)).toThrow(TypeError);
    });
});

describe('addMonthsToDate', () => {
    it('returns a new date n-months in the future in the same non-leap year.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const monthCount: number = 3;
        const expectedDate: Date = new Date(2001, DECEMBER_MONTH_INDEX, 11);
        const newDate: Date = addMonthsToDate(referenceDate, monthCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date n-months in the future in the same leap year.', () => {
        const referenceDate: Date = new Date(2004, FEBRUARY_MONTH_INDEX, 14);
        const monthCount: number = 6;
        const expectedDate: Date = new Date(2004, 7, 14);
        const newDate: Date = addMonthsToDate(referenceDate, monthCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date 13 months in the future.', () => {
        const referenceDate: Date = new Date(2001, SEPTEMBER_MONTH_INDEX, 11);
        const monthCount: number = 13;
        const expectedDate: Date = new Date(2002, OCTOBER_MONTH_INDEX, 11);
        const newDate: Date = addMonthsToDate(referenceDate, monthCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('throws TypeError with an invalid date.', () => {
        const invalidDate: Date = new Date('sudjfbosdnf');
        expect(() => addMonthsToDate(invalidDate, 10)).toThrow(TypeError);
    });
});

describe('addHoursToDate', () => {
    it('returns a new date n-hours in the future.', () => {
        const referenceDate: Date = new Date(Date.UTC(2001, SEPTEMBER_MONTH_INDEX, 11, 8, 46, 0, 0));
        const hoursCount: number = 8;
        const expectedDate: Date = new Date(Date.UTC(2001, SEPTEMBER_MONTH_INDEX, 11, 16, 46, 0, 0));
        const newDate: Date = addHoursToDate(referenceDate, hoursCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
        expect(newDate.getUTCHours()).toEqual(expectedDate.getUTCHours());
    });
    it('throws TypeError for an invalid date.', () => {
        const invalidDate: Date = new Date('invalidnlfnbsdjufn');
        expect(() => addHoursToDate(invalidDate, 10)).toThrow(TypeError);
    });
});

describe('addWeeksToDate', () => {
    it('returns a new date n-weeks in the future within a non-leap year.', () => {
        const referenceDate: Date = new Date(Date.UTC(2001, SEPTEMBER_MONTH_INDEX, 11));
        const weekCount: number = 3;
        const expectedDate: Date = new Date(Date.UTC(2001, OCTOBER_MONTH_INDEX, 2));
        const newDate: Date = addWeeksToDate(referenceDate, weekCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('returns a new date n-weeks in the future within a leap year.', () => {
        const referenceDate: Date = new Date(Date.UTC(2004, FEBRUARY_MONTH_INDEX, 15));
        const weekCount: number = 2;
        const expectedDate: Date = new Date(Date.UTC(2004, FEBRUARY_MONTH_INDEX, 29));
        const newDate: Date = new Date(Date.UTC(2004, FEBRUARY_MONTH_INDEX, 29));
    });
    it('throws a TypeError with an invalid date.', () => {
        const invalidDate: Date = new Date('fofofob');
        expect(() => addWeeksToDate(invalidDate, 10)).toThrow(TypeError);
    });
});

describe('addYearsToDate', () => {
    it('returns a new date n-years in the future.', () => {
        const referenceDate: Date = new Date(Date.UTC(2001, SEPTEMBER_MONTH_INDEX, 11));
        const yearCount: number = 20;
        const expectedDate: Date = new Date(Date.UTC(2021, SEPTEMBER_MONTH_INDEX, 11));
        const newDate: Date = addYearsToDate(referenceDate, yearCount);
        expect(isValidDate(newDate)).toEqual(true);
        expect(newDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear());
        expect(newDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth());
        expect(newDate.getUTCDate()).toEqual(expectedDate.getUTCDate());
    });
    it('throws a TypeError with an invalid date.', () => {
        const referenceDate: Date = new Date('onfusdnfs');
        expect(() => addYearsToDate(referenceDate, 20)).toThrow(TypeError);
    });
});
