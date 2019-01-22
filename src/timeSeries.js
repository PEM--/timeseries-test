// Floating point modificator
const FP = 1e7

const timeSeries = (timedEvents, rollingTime = 60) => {
  if (timedEvents.length === 0) return []
  // Some timed events could not beed ordered properly
  const sortedTe = timedEvents.sort(({ createdAt: a }, { createdAt: b }) => a - b)
  return sortedTe.map(({ createdAt, eventValue }, index) => {
    // Check if former values fits in the rolling window
    const teInRollingTime = []
    if (index > 0) {
      const startWindow = createdAt - rollingTime
      let rollingTimeIdx = index - 1
      let lastTeCreatedAt = sortedTe[rollingTimeIdx].createdAt
      while (lastTeCreatedAt > startWindow && rollingTimeIdx >= 0) {
        teInRollingTime.push(sortedTe[rollingTimeIdx].eventValue)
        rollingTimeIdx -= 1
        if (rollingTimeIdx >= 0) lastTeCreatedAt = sortedTe[rollingTimeIdx].createdAt
      }
    }
    const N_O = 1 + teInRollingTime.length
    const Roll_Sum = (
      FP * eventValue + teInRollingTime.reduce((acc, val) => acc + FP * val, 0)
    ) / FP
    return {
      Time: createdAt,
      Value: eventValue,
      N_O,
      Roll_Sum,
      Min_Value: Math.min(eventValue, ...teInRollingTime),
      Max_Value: Math.max(eventValue, ...teInRollingTime)
    }
  })
}
module.exports = timeSeries