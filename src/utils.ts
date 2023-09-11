
/* MAIN */

const clamp = ( number: number, lower: number, upper: number ): number => {

  if ( lower > upper ) return clamp ( number, upper, lower );

  return Math.min ( upper, Math.max ( lower, number ) );

};

const getClampedLeftOffsetTo = ( string: string, index: number, char: string ): number => {

  const indexPrev = Math.max ( 0, index - 1 );
  const charIndex = clamp ( getNormalizedLeftIndexTo ( string, indexPrev, char ), 0, string.length );
  const charOffset = ( index - charIndex );

  return charOffset;

};

const getClampedRightOffsetTo = ( string: string, index: number, char: string ): number => {

  const indexNext = Math.min ( string.length, index + 1 );
  const charIndex = clamp ( getNormalizedRightIndexTo ( string, indexNext, char ), 0, string.length );
  const charOffset = ( charIndex - index );

  return charOffset;

};

const getNormalizedLeftIndexTo = ( string: string, index: number, char: string ): number => {

  const charIndex = string.lastIndexOf ( char, index );

  return ( charIndex >= 0 ) ? charIndex : -Infinity;

};

const getNormalizedRightIndexTo = ( string: string, index: number, char: string ): number => {

  const charIndex = string.indexOf ( char, index );

  return ( charIndex >= 0 ) ? charIndex : Infinity;

};

const isRegExp = ( value: unknown ): value is RegExp => {

  return value instanceof RegExp;

};

/* EXPORT */

export {getClampedLeftOffsetTo, getClampedRightOffsetTo, getNormalizedLeftIndexTo, getNormalizedRightIndexTo, isRegExp};
