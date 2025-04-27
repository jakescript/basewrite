import { diffChars, diffLines, diffWords } from 'diff'

export const calculateCharacterCost = (original, newString) => {
  let charactersChanged = 0
  const changes = diffChars(original, newString)

  console.log({ changes, original, newString })

  changes.forEach(change => {
    if (change.added || change.removed) {
      charactersChanged += change.count
    }
  })

  console.log({ charactersChanged })

  return charactersChanged
}
