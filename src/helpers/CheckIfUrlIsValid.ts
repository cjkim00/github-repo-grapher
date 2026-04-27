
export function isUrlValid(url: string): boolean {
    //if the url length is 0 then the url cannot be valid
    if(url.length === 0) {
        return false;
    }

    const urlParts = url.split('/');

    if(urlParts.length < 3) {
        return false;
    }
    console.log(urlParts);
    if(urlParts[2] !== 'github.com' && urlParts[1] !== 'github.com' ) {
        return false;
    }

    return true;
}