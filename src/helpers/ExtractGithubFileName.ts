export default function extractGithubFileNameFromPath(path: string): string {
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1].split('.');
    return lastPart[0];
    //return parts[parts.length - 1];
}

export function extractGithubFileNameFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
}