export const isEmpty = (text) => {
    return text == null || text == undefined || text.trim().length <= 0;
};
export const validateEmail = (email) => {
    var reg = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return reg.test(email);
};
export const validDOB = (dob) => {
    var reg = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return reg.test(dob);
}