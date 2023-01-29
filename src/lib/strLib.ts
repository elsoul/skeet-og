export const toUpperCase = async (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const toLowerCase = async (text: string) => {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
