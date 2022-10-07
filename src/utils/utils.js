const formatDate = (date) => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    let hours = d.getHours().toString();
    let minutes = d.getMinutes().toString();

    // console.log(month);
    // console.log(day);

    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day;
    }
    if (hours.length < 2) {
        hours = "0" + hours;
    }
    if (minutes.length < 2) {
        minutes = "0" + minutes;
    }

    return `${day} thg ${month} ${year}, ${hours}:${minutes}`;
};

export { formatDate };
