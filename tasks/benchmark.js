
/* IMPORT */

import benchmark from 'benchloop';
import regexpRangedExec from '../dist/index.js';

/* MAIN */

benchmark.config ({
  iterations: 100
});

benchmark ({
  name: 'regexp-ranged-exec',
  fn: () => {
    //TODO
  }
});

benchmark.summary ();
