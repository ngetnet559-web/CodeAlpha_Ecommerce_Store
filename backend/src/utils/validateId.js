export const validateId = (id) => {
    const numberId = Number(id)

    if (!Number.isInteger(numberId) || numberId <= 0) {
    return null;
  }

  return numberId
}