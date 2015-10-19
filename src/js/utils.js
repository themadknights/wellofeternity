export function pad (number, zeros) {
    var s = number.toString();

    while (s.length < zeros) {
        s = "0" + s;
    }

    return s;
}
