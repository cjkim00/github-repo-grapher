import type { GithubFile } from './GithubFile';
export interface GithubResponse {
    sha: string,
    url: string,
    tree: GithubFile[],
    truncated: boolean
}