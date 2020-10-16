import { Paginated } from './common/Paginated';
import { ListGetterOptions } from './common/ListGetterOptions';
import { StatusResult } from 'simple-git';

/**
 * An interface of Git repository inspectors.
 */
export interface IGitInspector {
  /**
   * Get commits in the repository.
   *
   * @param options Options specifying a subset of all the repository commits.
   * @returns The specified commits.
   * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository).
   */
  getCommits(options: ListGetterOptions): Promise<Paginated<Commit>>;

  /**
   * Get authors in the repository.
   *
   * @param options Options specifying a subset of all the repository authors.
   * @returns The specified authors.
   * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository).
   */
  getAuthors(options: ListGetterOptions): Promise<Paginated<Author>>;

  /**
   * Get tags in the repository.
   *
   * @returns The tags.
   * @throws Throws an arror if there is no repository (the path does not exist, the path is not a repository).
   */
  getAllTags(): Promise<Tag[]>;

  /**
   * Get repository status info
   */
  getStatus(): Promise<StatusResult>;
}

/**
 * An interface of a Git commit.
 */
export interface Commit {
  /**
   * The commit hash.
   */
  sha: string;

  /**
   * The commit date.
   */
  date: Date;

  /**
   * The commit message.
   */
  message: string;

  /**
   * The commit author.
   *
   * An author is the original author of the changes.
   */
  author: Author;

  /**
   * The commit committer.
   *
   * A committer is the person who last applied the commit.
   */
  commiter?: Author;
  // ... todo
}

/**
 * An interface of a Git commit author.
 */
export interface Author {
  /**
   * The author's name.
   */
  name: string;

  /**
   * The author's email.
   */
  email: string;
}

/**
 * An interface of a Git tag.
 */
export interface Tag {
  /**
   * The tag's name.
   */
  tag: string;

  /**
   * The commit hash of the tag's commit.
   */
  commit: string;
}
