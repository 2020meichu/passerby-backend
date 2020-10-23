module.exports = (id) => {
  if (id.length != 10) {
    return false
  }

  const prefix_regex = /[a-zA-Z]/
  const numbers_regex = /\d{9}/
  const prefix = id[0]
  const numbers = id.substring(1)
  if (!prefix_regex.test(prefix)) {
    return false
  }
  if (!numbers_regex.test(numbers)) {
    return false
  }

  const prefixMapping = {
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,
    'G': 16,
    'H': 17,
    'I': 34,
    'J': 18,
    'K': 19,
    'L': 20,
    'M': 21,
    'N': 22,
    'O': 35,
    'P': 23,
    'Q': 24,
    'R': 25,
    'S': 26,
    'T': 27,
    'U': 28,
    'V': 29,
    'W': 32,
    'X': 30,
    'Y': 31,
    'Z': 33
  }

  const prefixNumber = prefixMapping[prefix.toUpperCase()]
  const allNumbers = prefixNumber + numbers
  const coefficient = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  let sum = 0
  for (let i = 0; i < allNumbers.length; i++) {
    sum += parseInt(allNumbers[i]) * coefficient[i]
  }
  if (sum % 10 !== 0) {
    return false
  }
  return true
}