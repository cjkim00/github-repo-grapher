import type { GithubFile } from '../objects/GithubFile';
import type { GithubFileContents } from '../objects/GithubFileContents';
import { extractRepoName } from '../helpers/ExtractRepoName';

export async function getRepoFiles(url: string): Promise<GithubFile[]> {
    const { user, repoName } = extractRepoName(url);
    const res = await fetch(`http://localhost:3000/api/repo?user=${user}&repo=${repoName}`);
    const data = await res.json();
    return Array.from(data.tree) as GithubFile[];
}

export async function getRepoFileContents(url: string): Promise<GithubFileContents> {
    const res = await fetch(url);
    return await res.json() as GithubFileContents;
}