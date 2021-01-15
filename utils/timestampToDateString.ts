export const timestampToDateString = (timestamp: number | string): string => {
    const dateObject = new Date(timestamp.toString());
    const day =
        dateObject.getDate().toString().length === 1
            ? `0${dateObject.getDate()}`
            : dateObject.getDate();
    const month =
        (dateObject.getMonth() + 1).toString().length === 1
            ? `0${dateObject.getMonth() + 1}`
            : dateObject.getMonth() + 1;

    const hours =
        dateObject.getHours().toString().length === 1
            ? `0${dateObject.getHours()}`
            : dateObject.getHours();
    const minutes =
        dateObject.getMinutes().toString().length === 1
            ? `0${dateObject.getMinutes()}`
            : dateObject.getMinutes();

    return `${hours}:${minutes} ${day}.${month}.${dateObject.getFullYear()}`;
};
