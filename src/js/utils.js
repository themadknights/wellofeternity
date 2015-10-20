export function pad(number, zeros = '00000000') {
    var s = number.toString();
    return zeros.substring(0, zeros.length - s.length) + s;
}
