
/* IMPORT */

import {describe, t} from 'fava';
import getRangedExec from '../dist/index.js';

/* HELPERS */

const testRange = ( re, index, input, expectedRange ) => {
  re.lastIndex = index;
  const exec = getRangedExec ( re );
  const execution = exec ( input );
  re.lastIndex = index;
  const expectedResult = re.exec ( input );
  console.log ( execution );
  t.deepEqual ( execution.result, expectedResult );
  t.deepEqual ( execution.range, expectedRange );
};

/* MAIN */

//TODO: Add way more tests

describe ( 'Regexp Ranged Exec', it => {

  it ( 'it does the basics right', () => {

    testRange ( /([a]+)/, 0, 'some aaa input', [0, 9] );
    testRange ( /aaa/, 0, 'some aaa input', [0, 15] );

    testRange ( /([a]+)/, 2, 'some aaa input', [0, 9] );
    testRange ( /aaa/, 2, 'some aaa input', [0, 15] );

    testRange ( /([a]+)/g, 2, 'some aaa input', [0, 7] );
    testRange ( /aaa/g, 2, 'some aaa input', [2, 13] );

  });

});
