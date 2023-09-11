
/* MAIN */

type Category = (
 0 | // No useful range can be detected (entire input + 1)
 1 | // A precise range can be detected (sub-line, potentially)
 2 // An imprecise range can be detected (line)
);

type Metadata = {
  HAS_FULL_CAPTURING_GROUP: boolean, // The entire regex is wrapped in a single capturing group
  HAS_FULL_CHARACTERS_CLASS: boolean, // A single character class matches in the regex, optionally wrapped in a group, optionally followed by a quantifier, optionally followed by a value or a dot
  HAS_ANCHOR_LEFT: boolean, // The regex contains an ^
  HAS_ANCHOR_RIGHT: boolean, // The regex contains a $, \b, or \B
  HAS_LOOKAROUND_LEFT: boolean, // The regex contains a positive or negative lookbehind
  HAS_LOOKAROUND_RIGHT: boolean, // The regex contains a positive or negative lookahead
  HAS_DISJUNCTION: boolean, // The regex contains a disjunction
  HAS_QUANTIFIER: boolean, // The regex contains a quantifier
  HAS_NEWLINE: boolean // The regex can match a newline
};

type Range = [ // These are offsets from the start index, not indices
  left: number,
  right: number
];

type RegExpRangedExec = {
  ( string: string ): RegExpRangedExecArray
};

type RegExpRangedExecArray = {
  result: RegExpExecArray | null,
  range: Range
};

/* EXPORT */

export type {Category, Metadata, Range, RegExpRangedExec, RegExpRangedExecArray};
