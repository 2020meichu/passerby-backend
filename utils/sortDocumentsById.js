module.exports = (documents) => {
  return documents.sort((prev, next) => prev.id - next.id)
}