
export function get_pretty_datetime(timestamp) {
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    let sent_at = new Date()
    sent_at.setTime(timestamp * 1000)

    let sent_at_string = ' '

    if ((sent_at.getFullYear() == today.getFullYear())
        && (sent_at.getMonth() == today.getMonth())
        && (sent_at.getDate() == today.getDate())) {
        sent_at_string =  sent_at_string + 'сегодня'
    } else if ((sent_at.getFullYear() == yesterday.getFullYear())
        && (sent_at.getMonth() == yesterday.getMonth())
        && (sent_at.getDate() == yesterday.getDate())) {
        sent_at_string =  sent_at_string + 'вчера'
    } else {
        sent_at_string = sent_at_string + ' '
            + sent_at.getDate()
            + '.' + (sent_at.getMonth() + 1)
            + '.'+ sent_at.getFullYear()
    }

    return sent_at_string
        + ' в ' + sent_at.getHours()
        + ':' + ((sent_at.getMinutes() < 10) ? "0" + sent_at.getMinutes(): sent_at.getMinutes())
}