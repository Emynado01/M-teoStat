let selectedParams = {
    menu: '',
    province: '',
    year: ''
  };
  
  export const setParams = (menu, province, year) => {
    selectedParams = { menu, province, year };
  };
  
  export const getParams = () => selectedParams;
  