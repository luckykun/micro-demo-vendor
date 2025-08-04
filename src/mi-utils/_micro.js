export const _allMicroApplications = {};

const utils = {
  registerApp: (name, App) => {
    _allMicroApplications[name] = App;
  },

  getApplication: (name) => _allMicroApplications[name],
};


export default utils;
