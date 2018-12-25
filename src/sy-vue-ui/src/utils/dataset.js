export function separateColumnsAndIndex (dataset) {
  return {
    columns: dataset[0].filter((item, index) => index),
    index: dataset.filter((item, index) => index).map(item => item[0]),
    data: dataset.reduce((accu, curr, currIndex) => {
      if (!currIndex) return accu
      const row = curr.reduce((ac, cu, ci) => {
        if (!ci) return ac
        ac.push(cu)
        return ac
      }, [])
      accu.push(row)
      return accu
    }, [])
  }
}
