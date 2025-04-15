import { diffChars } from 'diff'

export const calculateCharacterCost = (original, newString) => {
  let charactersChanged = 0
  const changes = diffChars(original, newString)

  changes.forEach(change => {
    if (change.added || change.removed) {
      charactersChanged += change.count
    }
  })

  return charactersChanged
}
