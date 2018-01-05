/* flow */

const cleanStateKey = key => {
  return key === null || key === undefined ? 'main' : key.toString();
};

export default cleanStateKey;
