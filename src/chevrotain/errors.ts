// Helper function to extract the relevant line and highlight the error
function highlightErrorLine(
  input: string,
  line: number,
  column: number,
): string {
  const lines = input.split("\n");
  const targetLine = lines[line - 1] || ""; // Get the specified line or an empty string
  const pointerLine = " ".repeat(column - 1) + "^"; // Highlight column with ^
  return `${targetLine}\n${pointerLine}`;
}

// Format lexing errors
export function formatLexingErrors(errors: any[], input: string): string {
  return errors
    .map((error) => {
      const location = `at line ${error.line}, column ${error.column}`;
      const highlightedSnippet = highlightErrorLine(
        input,
        error.line,
        error.column,
      );
      return `Lexing error ${location}:\n${highlightedSnippet}\n${error.message}`;
    })
    .join("\n\n");
}

// Format parsing errors
export function formatParsingErrors(errors: any[], input: string): string {
  return errors
    .map((error) => {
      const { token, previousToken } = error;
      const location = token.startLine && token.startColumn
        ? `at line ${token.startLine}, column ${token.startColumn}`
        : "at the end of the input";

      const previousTokenInfo = previousToken
        ? ` It occurred after '${previousToken.image}' (line ${previousToken.startLine}, column ${previousToken.startColumn}).`
        : "";

      const snippet = token.tokenType.name === "EOF"
        ? `${input.split("\n").pop() || ""}\n${
          " ".repeat(input.split("\n").pop()?.length || 0)
        }^`
        : highlightErrorLine(
          input,
          token.startLine || 1,
          token.startColumn || 1,
        );

      let message =
        `Parsing error ${location}.${previousTokenInfo}\n${snippet}`;
      message += token.tokenType.name === "EOF"
        ? `\nThe parser expected more input but reached the end of the file.`
        : `\nUnexpected token '${token.image}'.`;

      return message;
    })
    .join("\n\n");
}
