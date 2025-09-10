import { createNumericRangeInclusive } from "./utils";

export const JANUARY_MONTH_INDEX = 0;
export const FEBRUARY_MONTH_INDEX = 1;
export const MARCH_MONTH_INDEX = 2;
export const APRIL_MONTH_INDEX = 3;
export const MAY_MONTH_INDEX = 4;
export const JUNE_MONTH_INDEX = 5;
export const JULY_MONTH_INDEX = 6;
export const AUGUST_MONTH_INDEX = 7;
export const SEPTEMBER_MONTH_INDEX = 8;
export const OCTOBER_MONTH_INDEX = 9;
export const NOVEMBER_MONTH_INDEX = 10;
export const DECEMBER_MONTH_INDEX = 11;

export const DAYS_IN_JANUARY = 31;
export const DAYS_IN_FEBRUARY_LEAP_YEAR = 29;
export const DAYS_IN_FEBRUARY_NON_LEAP_YEAR = 28;
export const DAYS_IN_MARCH = 31;
export const DAYS_IN_APRIL = 30;
export const DAYS_IN_MAY = 31;
export const DAYS_IN_JUNE = 30;
export const DAYS_IN_JULY = 31;
export const DAYS_IN_AUGUST = 31;
export const DAYS_IN_SEPTEMBER = 30;
export const DAYS_IN_OCTOBER = 31;
export const DAYS_IN_NOVEMBER = 30;
export const DAYS_IN_DECEMBER = 31;


export function isLeapYear(fullYear: number): boolean {
    return (fullYear % 4) === 0;
}

export function getDaysInMonth(monthIndex: number, isLeapYear: boolean): number {
    if (monthIndex < 0 || monthIndex > 11) {
        throw new RangeError(`The number ${monthIndex} is out of the range of valid month indexes (0..11)`);
    }
    const daysInMonth: number[] = [
        DAYS_IN_JANUARY,
        (isLeapYear ? DAYS_IN_FEBRUARY_LEAP_YEAR : DAYS_IN_FEBRUARY_NON_LEAP_YEAR),
        DAYS_IN_MARCH,
        DAYS_IN_APRIL,
        DAYS_IN_MAY,
        DAYS_IN_JUNE,
        DAYS_IN_JULY,
        DAYS_IN_AUGUST,
        DAYS_IN_SEPTEMBER,
        DAYS_IN_OCTOBER,
        DAYS_IN_NOVEMBER,
        DAYS_IN_DECEMBER,
    ];
    const count: number = daysInMonth[monthIndex];
    return count;
}

export function getDaysInYear(fullYear: number): number {
    if (isLeapYear(fullYear)) {
        return 366;
    } else {
        return 365;
    }
}

export function addMonthToDate(startDate: Date): Date {
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const day: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year, month + 1, day, hours, minutes, seconds, milliseconds));
    return newDate;
}

export function addMonthsToDate(startDate: Date, monthCount: number): Date {
    if (!isValidDate(startDate)) {
        throw new TypeError('Invalid date');
    }
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const date: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year, month + monthCount, date, hours, minutes, seconds, milliseconds));
    return newDate;
}

export function addHoursToDate(startDate: Date, hoursCount: number): Date {
    if (!isValidDate(startDate)) {
        throw new TypeError('Invalid date');
    }
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const date: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year, month, date, hours + hoursCount, minutes, seconds, milliseconds));
    return newDate;
}

export function addDaysToDate(startDate: Date, dayCount: number): Date {
    if (!isValidDate(startDate)) {
        throw new TypeError('Invalid date');
    }
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const date: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year, month, date + dayCount, hours, minutes, seconds, milliseconds));
    return newDate;
}

export function addWeeksToDate(startDate: Date, weekCount: number): Date {
    if (!isValidDate(startDate)) {
        throw new TypeError('Invalid Date');
    }
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const date: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year, month, date + (weekCount * 7), hours, minutes, seconds, milliseconds));
    return newDate;
}

export function addYearsToDate(startDate: Date, yearCount: number): Date {
    if (!isValidDate(startDate)) {
        throw new TypeError('Invalid date');
    }
    const year: number = startDate.getUTCFullYear();
    const month: number = startDate.getUTCMonth();
    const date: number = startDate.getUTCDate();
    const hours: number = startDate.getUTCHours();
    const minutes: number = startDate.getUTCMinutes();
    const seconds: number = startDate.getUTCSeconds();
    const milliseconds: number = startDate.getUTCMilliseconds();
    const newDate: Date = new Date(Date.UTC(year + yearCount, month, date, hours, minutes, seconds, milliseconds));
    return newDate;
}

export function countDaysInRangeOfMonthsFromStartDate(startDate: Date, monthCount: number): number {
    const month: number = startDate.getUTCMonth();
    const monthIndexRange: number[] = createNumericRangeInclusive(month, month + monthCount - 1);
    let nextDate: Date = new Date(startDate);
    const dayCount: number = monthIndexRange.reduce((carry: number, _current: number, index: number): number => {
        if (index === 0) {
            const count: number = getDaysInMonth(nextDate.getUTCMonth(), isLeapYear(nextDate.getUTCFullYear()));
            return count;
        } else {
            nextDate = addMonthToDate(nextDate);
            const count: number = getDaysInMonth(nextDate.getUTCMonth(), isLeapYear(nextDate.getUTCFullYear()));
            return count + carry;
        }
    }, 0);
    return dayCount;
}

export function countDaysInRangeOfYears(startDate: Date, yearCount: number): number {
    const year: number = startDate.getUTCFullYear();
    const yearRange: number[] = createNumericRangeInclusive(year, year + yearCount - 1);
    const sumOfDays: number = yearRange.reduce((carry: number, current: number): number => {
        const daysInYear: number = getDaysInYear(current);
        return daysInYear + carry;
    }, 0);
    return sumOfDays;
}

export function isValidDate(referenceDate: Date): boolean {
    const isInstance: boolean = referenceDate instanceof Date;
    const isNotInvalid: boolean = referenceDate.toString().toLowerCase() !== 'invalid date';
    const isNotNaN: boolean = !isNaN(referenceDate.valueOf());
    return isInstance && isNotInvalid && isNotNaN;
}

export function isDateBeforeOtherDate(referenceDate: Date, otherDate: Date): boolean {
    const referenceTime: number = referenceDate.getTime();
    const otherTime: number = otherDate.getTime();
    const isBefore: boolean = otherTime - referenceTime > 0;
    return isBefore;
}

export function isDateAfterOtherDate(referenceDate: Date, otherDate: Date): boolean {
    const referenceTime: number = referenceDate.getTime();
    const otherTime: number = otherDate.getTime();
    const isAfter: boolean = referenceTime - otherTime > 0;
    return isAfter;
}

export function countDaysBetweenDates(startDate: Date, endDate: Date): number {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new TypeError('Invalid date');
    }
    let start: Date, end: Date;
    if (isDateBeforeOtherDate(startDate, endDate)) {
        start = startDate;
        end = endDate;
    } else if (isDateAfterOtherDate(startDate, endDate)) {
        start = endDate;
        end = startDate;
    } else {
        return 0;
    }
    const numberOfYearsBetweenDates: number = countYearsBetweenDates(start, end);
    let monthCount: number = end.getUTCMonth() - start.getUTCMonth() + 1;
    if (numberOfYearsBetweenDates > 0) {
        monthCount += (numberOfYearsBetweenDates * 12);
    }
    const sumOfDaysInMonths: number = countDaysInRangeOfMonthsFromStartDate(start, monthCount);
    const numberOfDaysFromStartDateToSubtract: number = start.getUTCDate();
    const numberOfDaysFromEndDateToSubtract: number = getDaysInMonth(
        end.getUTCMonth(),
        isLeapYear(end.getUTCFullYear()),
    ) - end.getUTCDate();
    const numberOfDaysToSubtract: number = numberOfDaysFromStartDateToSubtract + numberOfDaysFromEndDateToSubtract;
    const dayCount: number = sumOfDaysInMonths - numberOfDaysToSubtract;
    return dayCount;
}

export function countYearsBetweenDates(startDate: Date, endDate: Date): number {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new TypeError('Invalid date');
    }
    if (isDateBeforeOtherDate(startDate, endDate)) {
        const startYear: number = startDate.getUTCFullYear();
        const endYear: number = endDate.getUTCFullYear();
        const years: number = endYear - startYear;
        return years;
    } else if (isDateAfterOtherDate(startDate, endDate)) {
        const startYear: number = startDate.getUTCFullYear();
        const endYear: number = endDate.getUTCFullYear();
        const years: number = startYear - endYear;
        return years;
    } else {
        return 0;
    }
}
