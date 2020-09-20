const initialState = {
  loading: false,
  loadingMessage: ""
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_LOADING':
      let loading = action.payload.value;
      let loadingMessage = action.payload.message;
      return {
        ...state,
        loading,
        loadingMessage
      };

    default: return state
  }
}

export default loadingReducer;