export function createGithubApiUrl(user: string, repoName: string): string {
        return `https://api.github.com/repos/${user}/${repoName}/git/trees/HEAD?recursive=1`;
}