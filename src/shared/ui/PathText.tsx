import { Fragment } from "react";

/**
 * A file or folder path that wraps after each slash instead of in the middle
 * of a name; a single segment too long for its box still breaks as a last resort.
 */
export function PathText({
  path,
  className = "",
}: {
  path: string;
  className?: string;
}) {
  const parts = path.split("/");
  return (
    <span className={`[overflow-wrap:anywhere] ${className}`}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <>
              /<wbr />
            </>
          )}
        </Fragment>
      ))}
    </span>
  );
}
