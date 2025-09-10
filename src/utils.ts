/**
 * Return an array of integers from start to end inclusive.
 * If start and end are equal then a single element array is returned with that value.
 * @param start 
 * @param end 
 * @returns 
 */
export function createNumericRangeInclusive(start: number, end: number): number[] {
    const lowerBound: number = Math.floor(start);
    const upperBound: number = Math.floor(end);
    if (lowerBound === upperBound) {
        return [lowerBound];
    }
    
    const length: number = Math.abs(upperBound - lowerBound) + 1;
    const numbers: number[] = Array.from((new Array(length)).keys());
    if (start < end) {
        const offsetNumbers: number[] = numbers.map(i => i + start);
        return offsetNumbers;
    } else {
        const offsetNumbers: number[] = numbers.map(i => i + end);
        return offsetNumbers;
    }
}


/**
 * Returns a boolean based on deep equality comparison of two values.
 * @param a 
 * @param b 
 * @param allowNaNEqual 
 * @returns 
 */
export function objectsAreDeeplyEqual<Type extends Object>(a: Type, b: Type, allowNaNEqual: boolean = true): boolean {
    if (!a && !b) {
        if (typeof a === typeof b) {
            return true;
        } else {
            return false;
        }
    } else if (!a || !b) {
        return false;
    }
    const aKeys: Array<keyof Type> = Object.keys(a) as Array<keyof Type>;
    const primitiveTypes: string[] = ['number', 'string', 'boolean', 'bigint', 'undefined', 'symbol', 'null'];

    for (let i = 0; i < aKeys.length; ++i) {
        const ak = aKeys[i];
        const av = a[ak];
        const bv = b[ak];
        
        const typeOfValue: string = typeof av;
        if (primitiveTypes.includes(typeOfValue)) {
            if (typeOfValue === 'number' && allowNaNEqual && isNaN(av as number) && isNaN(bv as number)) {
                continue;
            }
            if (av !== bv) {
                return false;
            }
        } else if (Array.isArray(av) && Array.isArray(bv)) {
            if (av.length !== bv.length) {
                return false;
            }
            if (!av.every((v, i) => objectsAreDeeplyEqual(v, bv[i]))) {
                return false;
            }
        } else {
            const isEqual: boolean = objectsAreDeeplyEqual(av as Type, bv as Type);
            if (!isEqual) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Returns a subset of properties of the `original` value that are different from the state
 * of the `update` value.
 * @param original 
 * @param update 
 * @returns 
 */
export function filterDifferentObjectProperties<Type extends Object>(
    original: Type,
    update: Type,
): Partial<Type> {
    const diff: Partial<Type> = Object.entries(original).reduce((carry, current) => {
        const [k, v] = current;
        if (!objectsAreDeeplyEqual(update[k as keyof Type], v)) {
            carry[k as keyof Type] = v;
        }
        return carry;
    }, {} as Partial<Type>);
    return diff;
}
