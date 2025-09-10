import { createNumericRangeInclusive, filterDifferentObjectProperties, objectsAreDeeplyEqual } from "../src/utils";

describe('createNumericRangeInclusive', () => {
    it('returns an inclusive range between two positive integers.', () => {
        const start: number = 1;
        const end: number = 10;
        const length: number = 10;
        const expectedRange: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const range: number[] = createNumericRangeInclusive(start, end);
        expect(range.length).toEqual(length);
        expect(range).toEqual(expect.arrayContaining(expectedRange));
    });
    it('returns an inclusive range between two negative integers.', () => {
        const start: number = -1;
        const end: number = -10;
        const length: number = 10;
        const expectedRange: number[] = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10];
        const range: number[] = createNumericRangeInclusive(start, end);
        expect(range.length).toEqual(length);
        expect(range).toEqual(expect.arrayContaining(expectedRange));
    });
    it('returns an inclusive range between a positive and a negative.', () => {
        const start: number = 5;
        const end: number = -5;
        const length: number = 11;
        const expectedRange: number[] = [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5];
        const range: number[] = createNumericRangeInclusive(start, end);
        expect(range.length).toEqual(length);
        expect(range).toEqual(expect.arrayContaining(expectedRange));
    });
    it('returns an inclusive range between a negative and a positive.', () => {
        const start: number = -10;
        const end: number = 10;
        const length: number = 21;
        const expectedRange: number[] = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const range: number[] = createNumericRangeInclusive(start, end);
        expect(range.length).toEqual(length);
        expect(range).toEqual(expect.arrayContaining(expectedRange));
    });
    it('returns a single length array when start and end are the same value.', () => {
        const start: number = 1;
        const end: number = 1;
        const length: number = 1;
        const expectedRange: number[] = [1];
        const range: number[] = createNumericRangeInclusive(start, end);
        expect(range.length).toEqual(length);
        expect(range).toEqual(expect.arrayContaining(expectedRange));
    })
});


describe('filterDifferentObjectProperties', () => {

    type TestSubject = {
        foo: string;
        bar: number;
        baz: boolean;
        bat: null;
    };

    it('returns an object with no own, enumerable properties for an object that has not changed.', () => {
        const orignal: TestSubject = {
            foo: 'foo',
            bar: 1,
            baz: true,
            bat: null,
        };
        const update: TestSubject = {
            foo: 'foo',
            bar: 1,
            baz: true,
            bat: null,
        };
        const diff: Partial<TestSubject> = filterDifferentObjectProperties(orignal, update);
        const areEqual: boolean = Object.keys(diff).length === 0;
        expect(areEqual).toEqual(true);
    }); 
    it('returns an object with the proprties of one object that are different from the other.', () => {
        const original: TestSubject = {
            foo: 'foo',
            bar: 1,
            baz: true,
            bat: null,
        };
        const update: TestSubject = {
            foo: 'bar',
            bar: 0,
            baz: false,
            bat: null,
        };
        const diff: Partial<TestSubject> = filterDifferentObjectProperties(original, update);
        const correct: boolean = Object.keys(diff).length === 3;
        expect(correct).toEqual(true);
        expect(Object.keys(diff).every(k => ['foo', 'bar', 'baz'].includes(k))).toEqual(true);
    });
});

describe('objectsAreDeeplyEqual', () => {
    type TestSubjectA = {
        foo: string;
        bar: Array<number>;
    };
    type TestSubjectB = {
        baz: TestSubjectA;
        bat: number;
    };
    it('returns true for equal objects', () => {
        const a: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1, 2, 3, 4],
            },
            bat: 1,
        };
        const b: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1, 2, 3, 4],
            },
            bat: 1,
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b);
        expect(areEqual).toEqual(true);
    });
    it('returns false for top level values not being equal.', () => {
        const a: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1, 2],
            },
            bat: 1,
        };
        const b: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1, 2],
            },
            bat: 2,
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b);
        expect(areEqual).toEqual(false);
    });
    it('returns false for nested level inequality', () => {
        const a: TestSubjectB = {
            baz: {
                foo: 'bar',
                bar: [1],
            },
            bat: 1,
        };
        const b: TestSubjectB = {
            baz:  {
                foo: 'foo',
                bar: [1, 2],
            },
            bat: 1,
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b);
        expect(areEqual).toEqual(false);
    });
    it('returns true for NaN when allowed.', () => {
        const a: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1],
            },
            bat: Number.NaN,
        };
        const b: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1],
            },
            bat: Number.NaN,
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b, true);
        expect(areEqual).toEqual(true);
    });
    it('returns false when NaN is not allowed.', () => {
        const a: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1],
            },
            bat: Number.NaN,
        };
        const b: TestSubjectB = {
            baz: {
                foo: 'foo',
                bar: [1],
            },
            bat: Number.NaN,
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b, false);
        expect(areEqual).toEqual(false);
    });
    it('returns false for two falsey values of different types.', () => {
        // This should not happen, but...
        const a: string = '';
        const b: number = 0;
        const areEqual: boolean = objectsAreDeeplyEqual(
            a as string,
            b as unknown as string,
        );
        expect(areEqual).toEqual(false);
    });
    it('returns false for objects with array properties of different lengths.', () => {
        type TestType = {
            foo: string[];
        };
        const a: TestType = {
            foo: ['a', 'b'],
        };
        const b: TestType = {
            foo: ['a', 'b', 'c'],
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b);
        expect(areEqual).toEqual(false);
    });
    it('returns false for objects with array properties of the smae length but with different values.', () => {
        type TestType = {
            foo: string[];
        };
        const a: TestType = {
            foo: ['1', '2', '3'],
        };
        const b: TestType = {
            foo: ['1', 'b', 'c'],
        };
        const areEqual: boolean = objectsAreDeeplyEqual(a, b);
        expect(areEqual).toEqual(false);
    });
});
