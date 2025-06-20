export const initialState = {
    basket: [],
    user:null,
    authUser:null,
}


export const getBasketTotal = (basket)=> basket?.reduce((amount,item) => item.price + amount,0);

const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
      case "ADD_TO_BASKET":
        return {
          ...state,
          basket: [...state.basket, action.item],
        };
      case "SET_BASKET":
        return {
          ...state,
          basket: action.basket,
        };
      case "EMPTY_BASKET":
        return {
          ...state,
          basket: [],
        };

      case "REMOVE_FROM_BASKET":
        const index = state.basket.findIndex(
          (basketItem) => basketItem.id === action.item.id
        );

        let newBasket = [...state.basket];

        if (index >= 0) {
          newBasket.splice(index, 1);
        } else {
          console.warn(`Cant remove product(id:${action.id})`);
        }
        return { ...state, basket: newBasket };

      case "SET_USER":
        return {
          ...state,
          user:action.user
        };

      case "SET_INAPPUSER":
        return {
          ...state,
          authUser: action.authUser,
        };

      default:
        return state;
    }
} ;

export default reducer;



