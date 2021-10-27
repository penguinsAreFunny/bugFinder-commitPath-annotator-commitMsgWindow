/**
 * Case insensitive check for corrective keywords: ["bug", "fix", "error", "fail"] in commit message (rawBody)
 *
 * Keywords to identify corrective commits
 * Ref: A. Mockus and L. G. Votta, Identifying Reasons for Software Changes Using Historic Databases
 * CORRECTIVE_KEYWORDS = ['bug', 'fix', 'error', 'fail']
 * @param locality
 * @constructor
 */
import {Commit, GitBinaryFile, GitFileType, GitTextFile} from "bugfinder-localityrecorder-commit";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";

export const FILTER_CORRECTIVE_MESSAGE = (locality: Commit) => {
    const CORRECTIVE_KEYWORDS = ["bug", "fix", "error", "fail"];
    const regExFilter = new RegExp(CORRECTIVE_KEYWORDS.join("|"), "i");
    return regExFilter.test(locality.rawBody);
}

/**
 * Commits containing more than two not test files are discarded.
 * Test and deleted files are ignored. Test files usually start with test or tests or end with spec.* or test.*.
 *
 * Inspired by
 * Thumb rule to identify corrective commits
 * Ref: T. J. Ostrand, E. J. Weyuker and R. M. Bell.
 * „Predicting the location and number of faults in large software systems“.
 * In: IEEE Transactions on Software Engineering31.4 (2005), Pages 340–355 [Page 5]
 * commits which affect more than 2 files are not classified as corrective commits
 * @param commit
 * @param testFileMatcher
 * @constructor
 */
export const FILTER_LESS_OR_EQUAL_TWO_FILES = (commit: Commit, testFileMatcher?: RegExp) => {
    const fileIsNotTestFile = (file: (GitTextFile | GitBinaryFile)) => {
        return testFileMatcher? !file.path.match(testFileMatcher): true;
    }

    const fileIsNotDeleted = (file: (GitTextFile | GitBinaryFile)) => {
        return file.type != GitFileType.deleted;
    }

    const files = commit.files.files;
    const notTestFiles = files.filter(fileIsNotTestFile);
    const notTestAndNotDeletedFiles = notTestFiles.filter(fileIsNotDeleted);
    return notTestAndNotDeletedFiles.length <= 2;
}

/**
 * Ignore merge commits
 * @param locality
 * @constructor
 */
export const FILTER_NO_MERGE_COMMIT = (locality: Commit) => {
    return locality.parentHashes.length <= 1;
}

/**
 * Ignore CommitPaths which are testfiles
 * @param commitPath
 * @param testFileMatcher
 * @constructor
 */
export const FILTER_NO_TEST_FILE = (commitPath: CommitPath, testFileMatcher: RegExp) => {
    return !commitPath.path?.path.match(testFileMatcher)
}