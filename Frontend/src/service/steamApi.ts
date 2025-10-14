export const test = async () => {
    const response = await fetch('http://localhost:3000/');
    const data = await response.text();
    console.log(data);
    return data;
}

export const getApplist = async () => {
    const response = await fetch('http://localhost:3000/steam/applist');
    const data = await response.json();
    console.log(data);
    return data;
}