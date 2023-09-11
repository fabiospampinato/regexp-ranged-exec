
/* IMPORT */

import re2ast from 'regjsparser';
import type {AstNode, RootNode} from 'regjsparser';
import type {Metadata} from './types';

/* MAIN */

// This function returns some metadata about the regex, which can be used to categorize the regex and to generate the appropriate exec function

const inspect = ( re: RegExp ): Metadata => {

  const LF = 10; // \n

  const metadata: Metadata = {
    HAS_FULL_CAPTURING_GROUP: false,
    HAS_FULL_CHARACTERS_CLASS: false,
    HAS_ANCHOR_LEFT: false,
    HAS_ANCHOR_RIGHT: false,
    HAS_LOOKAROUND_LEFT: false,
    HAS_LOOKAROUND_RIGHT: false,
    HAS_DISJUNCTION: false,
    HAS_QUANTIFIER: false,
    HAS_NEWLINE: false
  };

  const root = re2ast.parse ( re.source, re.flags, {
    lookbehind: true,
    modifiers: true,
    namedGroups: true,
    unicodePropertyEscape: true,
    unicodeSet: true
  });

  const traverse = ( node: AstNode | RootNode | typeof root ): void => {

    if ( node.type === 'alternative' ) { // Anything that can be matched

      node.body.forEach ( traverse );

    } else if ( node.type === 'anchor' ) { // ^, $, \b, \B

      if ( node.kind === 'start' ) { // ^

        metadata.HAS_ANCHOR_LEFT = true;

      } else if ( node.kind === 'end' || node.kind === 'boundary' || node.kind === 'not-boundary' ) { // $, \b, \B

        metadata.HAS_ANCHOR_RIGHT = true;

      } else {

        throw new Error ( 'Unsupported anchor kind' );

      }

    } else if ( node.type === 'characterClass' ) { // [abc], [a&&b], [a--b]

      const [start, end] = node.range;

      console.log({start, end});

      if ( ( !metadata.HAS_FULL_CAPTURING_GROUP && ( start === 0 && ( end === re.source.length || end === re.source.length - 1 ) ) ) || ( metadata.HAS_FULL_CAPTURING_GROUP && ( start === 1 && ( end === re.source.length - 1 || end === re.source.length - 2 ) ) ) ) { //TODO: Support quantifiers longer than 1 character too, like {1,3}

        metadata.HAS_FULL_CHARACTERS_CLASS = true;

      }

      if ( metadata.HAS_NEWLINE ) return; // This can now only tell us if a newline can be matched, and we know it can already

      if ( node.kind === 'union' ) { // [abc]

        node.body.forEach ( traverse );

        if ( node.negative ) { // Inverting the only flag that could have been set

          metadata.HAS_NEWLINE = !metadata.HAS_NEWLINE;

        }

      } else { //TODO: Support these too

        throw new Error ( 'Unsupported character class kind' );

      }

    } else if ( node.type === 'characterClassEscape' ) { // \d, \D, \s, \S, \w, \W

      if ( node.value === 'D' || node.value === 's' || node.value === 'W' ) {

        metadata.HAS_NEWLINE = true;

      }

    } else if ( node.type === 'characterClassRange' ) { // [a-z]

      const min = node.min.codePoint;
      const max = node.max.codePoint;

      if ( LF >= min && LF <= max ) {

        metadata.HAS_NEWLINE = true;

      }

    } else if ( node.type === 'disjunction' ) { // a|b

      metadata.HAS_DISJUNCTION = true;

      node.body.forEach ( traverse );

    } else if ( node.type === 'dot' ) { // .

      if ( re.dotAll ) { // Dots can match newlines with this flag

        metadata.HAS_NEWLINE = true;

      }

    } else if ( node.type === 'group' ) { // (), (?=), (?<=), (?!), (?<!), (?:)

      if ( node.behavior === 'lookbehind' || node.behavior === 'negativeLookbehind' ) {

        metadata.HAS_LOOKAROUND_LEFT = true;

        node.body.forEach ( traverse );

      } else if ( node.behavior === 'lookahead' || node.behavior === 'negativeLookahead' ) {

        metadata.HAS_LOOKAROUND_RIGHT = true;

        node.body.forEach ( traverse );

      } else if ( node.behavior === 'normal' ) {

        const [start, end] = node.range;

        if ( start === 0 && end === re.source.length ) {

          metadata.HAS_FULL_CAPTURING_GROUP = true;

        }

        node.body.forEach ( traverse );

      } else if ( node.behavior === 'ignore' ) {

        node.body.forEach ( traverse );

      } else {

        throw new Error ( 'Unsupported group kind' );

      }

    } else if ( node.type === 'quantifier' ) { // +, *, ?, {1,9}

      metadata.HAS_QUANTIFIER = true;

      node.body.forEach ( traverse );

    } else if ( node.type === 'reference' ) { // \1, \2, \3

      // Nothing to do about these

    } else if ( node.type === 'unicodePropertyEscape' ) { // \p{ASCII}, \P{ASCII}

      //TODO: Support these, by constructing the regex on the fly and checking if it can match a newline

      throw new Error ( 'Unsupported unicode proprety escape' );

    } else if ( node.type === 'value' ) { // a, b, c

      if ( node.codePoint === LF ) {

        metadata.HAS_NEWLINE = true;

      }

    } else {

      throw new Error ( 'Unsupported node type' );

    }

  }

  traverse ( root );

  return metadata;

};

/* EXPORT */

export default inspect;
