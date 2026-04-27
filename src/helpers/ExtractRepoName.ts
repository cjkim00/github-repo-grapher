export function extractRepoName(url: string): { user: string, repoName: string } {

    const urlParts = url.split('/');

    return { user: urlParts[3], repoName: urlParts[4] };
}