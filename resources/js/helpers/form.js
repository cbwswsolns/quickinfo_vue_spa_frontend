export default {
  generateFormCheckboxSelectedList(dataArrayOfObjects) {
    const arr = [];

    for (let i = 0; i < dataArrayOfObjects.length; i++) {
      arr.push(dataArrayOfObjects[i]['id']);
    }

    return arr;
  },
  generateFormSelectOptionsList(dataArrayOfObjects, formFirstOptionText) {

    const arr = [];
    const initialOption = [];

    initialOption['value'] = null;
    initialOption['text']  = formFirstOptionText;

    arr.push(Object.assign({}, initialOption));

    for (let i = 0; i < dataArrayOfObjects.length; i++) {

      const option = [];
      for (const key in dataArrayOfObjects[i]) {
        if (key === 'id') {
          option['value'] = dataArrayOfObjects[i][key];
        } else if (key === 'name') {
          option['text'] = dataArrayOfObjects[i][key];
        }
      }

      arr.push(Object.assign({}, option));
    }

    return arr;
  },
  invalidFeedback(vuelidateFieldObject, fieldStr) {
    let msg = '';

    if ('required' in vuelidateFieldObject) {
      !vuelidateFieldObject.required ?
        msg = fieldStr + ' is required! ' : null;
    }

    if ('email' in vuelidateFieldObject) {
      !vuelidateFieldObject.email ?
        msg += 'Invalid email format! ' : null;
    }

    if ('minLength' in vuelidateFieldObject) {
      !vuelidateFieldObject.minLength ?
        msg += 'Minimum length of ' +
          vuelidateFieldObject.$params.minLength.min + ' characters! ' : null;
    }

    if ('sameAsPassword' in vuelidateFieldObject) {
      !vuelidateFieldObject.sameAsPassword ?
        msg += 'Does not match entered password! ' : null;
    }

    if ('minQuillContentLength' in vuelidateFieldObject) {
      !vuelidateFieldObject.minQuillContentLength ?
        msg += 'Editor content too short! ' : null;
    }

    return msg;
  }
};

