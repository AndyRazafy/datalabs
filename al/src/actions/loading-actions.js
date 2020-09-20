export function loadingAction(value, message) {
  return {
    type: 'UPDATE_LOADING',
    payload: {
      value,
      message
    }
  }
}