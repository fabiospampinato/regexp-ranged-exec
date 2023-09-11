
/* IMPORT */

import inspect from './inspect';
import {isRegExp} from './utils';
import type {Category, Metadata} from './types';

/* MAIN */

// This function decides what kind of exec function to generate

const categorize = ( re: RegExp | Metadata ): Category => {

  const metadata = isRegExp ( re ) ? inspect ( re ) : re;

  if ( metadata.HAS_FULL_CAPTURING_GROUP && metadata.HAS_FULL_CHARACTERS_CLASS ) {

    return 1;

  }

  if ( !metadata.HAS_NEWLINE ) {

    return 2;

  }

  return 0;

};

/* EXPORT */

export default categorize;
