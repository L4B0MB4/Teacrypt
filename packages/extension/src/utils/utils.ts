export function getElementsByXPath(xpath: string, parent?: Element) {
  let results = [];
  let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results as Array<HTMLElement>;
}
