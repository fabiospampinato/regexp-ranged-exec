
/* IMPORT */

import categorize from './categorize';
import inspect from './inspect';
import {getClampedLeftOffsetTo, getClampedRightOffsetTo} from './utils';
import type {Range, RegExpRangedExec, RegExpRangedExecArray} from './types';

/* MAIN */

const generate = ( re: RegExp ): RegExpRangedExec => {

  const metadata = inspect ( re );
  const category = categorize ( metadata );
  const hasLastIndex = ( re.global || re.sticky );

  if ( category === 0 ) { // Unsupported

    return ( string: string ): RegExpRangedExecArray => {

      const result = re.exec ( string );
      const range: Range = [0, string.length + 1]; // Dummy range, the regex might depend on everything for all we know

      return {result, range};

    };

  } else if ( category === 1 ) { // Simple capturing

    return ( string: string ): RegExpRangedExecArray => {

      const index = hasLastIndex ? re.lastIndex : 0;
      const result = re.exec ( string );

      const left = 0;
      const right = result ? ( result.index - index ) + result[1].length + 1 : getClampedRightOffsetTo ( string, index, '\n' ) + 1;
      const range: Range = [left, right];

      return {result, range};

    };

  } else if ( category === 2 ) { // No newline

    return ( string: string ): RegExpRangedExecArray => {

      const index = hasLastIndex ? re.lastIndex : 0;
      const result = re.exec ( string );

      const left = getClampedLeftOffsetTo ( string, index, '\n' );
      const right = getClampedRightOffsetTo ( string, index, '\n' ) + 1;
      const range: Range = [left, right];

      return {result, range};

    };

  } else {

    throw new Error ( 'Unsupported category' );

  }

};

/* EXPORT */

export default generate;
