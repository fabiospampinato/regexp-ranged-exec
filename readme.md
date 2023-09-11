# RegExp Ranged Exec

Generate an enhanced `exec` function, with information about the range of text that the regex paid attention to.

This is useful for caching the result of a regex, or a series of regexes, when the portion of the input they looked at didn't change.

## Details

- The calculated range is a conservative estimate and it's not precise for every regex.
- Regexes that capture everything, and have a single character class inside them, optionally followed by a quantifier, a character or a dot, produce the most precise ranges.
- Regexes that never match "\n" produce a range that is roughly the one containing the line that contains the index that the regex started matching from.
- All other regexes will give you a useless range, one enclosing the whole input.

## Install

```sh
npm install --save regexp-ranged-exec
```

## Usage

```ts
import getRangedExec from 'regexp-ranged-exec';

// You can create an enhanced "exec" function like this

const input = 'some aaa input';
const re = /aaa/;
const exec = getRangedExec ( re );
const execution = exec ( input );

// The execution object contains both whatever `RegExp.prototype.exec` would have given you, and the detected "range" for this match
// The range tells you how many characters to the left and right of the starting point the regex paid attention to
// If characters within that range don't change then it's guaranteed that the regex will return the same result
// The starting point of a regex is its "lastIndex" property, if the regex is either global or sticky, or 0 otherwise

const match = execution.result; // Whatever `RegExp.prototype.exec` returned
const range = execution.range; // [0, 9], the left and right offsets for this execution
```

## License

MIT © Fabio Spampinato
