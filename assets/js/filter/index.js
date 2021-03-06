import moment from 'moment'

export default {
  date(date, formatString = "YYYY-MM-DD hh:mm:ss") {
    return moment(date).format(formatString);
  },
  toFixed(number, fractionDigits = 2, showNaN) {
    let _number = number * 1;
    if (typeof _number === 'number') {
      return _number.toFixed(2);
    } else {
      if (showNaN) {
        return "NaN";
      } else {
        _number = 0;
        return _number.toFixed(2);
      }
    }
  },
  toMore(number,threshold = 100){
    if(number>threshold){
      return 99
    }
    return number
  }
};
