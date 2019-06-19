
export function dateToDate (date) {
    let sDate = new Date();
    if (typeof date === 'object' && typeof new Date().getMonth === "function" ) {
        sDate = date;
    }
    else if (typeof date === "string") {
        let arr = date.split('-')
        if (arr.length === 3) {
            sDate = new Date(`${arr[0]}-${arr[1]}-${arr[2]}`);
        }
    }
    return sDate;
}

export function addMonth (date, num) {
    num = Number(num);
    const sDate = dateToDate(date);
  
    const sYear = sDate.getFullYear();
    const sMonth = sDate.getMonth() + 1;
    const sDay = sDate.getDate();
  
    let eYear = sYear;
    let eMonth = sMonth + num;
    let eDay = sDay;
    while (eMonth > 12) {
        eYear++;
        eMonth -= 12;
    }
  
    let eDate = new Date(eYear, eMonth - 1, eDay);
  
    while (eDate.getMonth() !== eMonth - 1) {
        eDay--;
        eDate = new Date(eYear, eMonth - 1, eDay);
    }
  
    return eDate;
}

export function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let params = {};
    for (let i=0;i<vars.length;i++) {
        let pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
        params[pair[0]] = pair[1];
    }
    return params;
}
  