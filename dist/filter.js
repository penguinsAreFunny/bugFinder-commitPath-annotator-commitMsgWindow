"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILTER_NO_TEST_FILE = exports.FILTER_NO_MERGE_COMMIT = exports.FILTER_LESS_OR_EQUAL_TWO_FILES = exports.FILTER_CORRECTIVE_MESSAGE = void 0;
/**
 * Case insensitive check for corrective keywords: ["bug", "fix", "error", "fail"] in commit message (rawBody)
 *
 * Keywords to identify corrective commits
 * Ref: A. Mockus and L. G. Votta, Identifying Reasons for Software Changes Using Historic Databases
 * CORRECTIVE_KEYWORDS = ['bug', 'fix', 'error', 'fail']
 * @param locality
 * @constructor
 */
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var FILTER_CORRECTIVE_MESSAGE = function (locality) {
    var CORRECTIVE_KEYWORDS = ["bug", "fix", "error", "fail"];
    var regExFilter = new RegExp(CORRECTIVE_KEYWORDS.join("|"), "i");
    return regExFilter.test(locality.rawBody);
};
exports.FILTER_CORRECTIVE_MESSAGE = FILTER_CORRECTIVE_MESSAGE;
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
var FILTER_LESS_OR_EQUAL_TWO_FILES = function (commit, testFileMatcher) {
    var fileIsNotTestFile = function (file) {
        return testFileMatcher ? !file.path.match(testFileMatcher) : true;
    };
    var fileIsNotDeleted = function (file) {
        return file.type != bugfinder_localityrecorder_commit_1.GitFileType.deleted;
    };
    var files = commit.files.files;
    var notTestFiles = files.filter(fileIsNotTestFile);
    var notTestAndNotDeletedFiles = notTestFiles.filter(fileIsNotDeleted);
    return notTestAndNotDeletedFiles.length <= 2;
};
exports.FILTER_LESS_OR_EQUAL_TWO_FILES = FILTER_LESS_OR_EQUAL_TWO_FILES;
/**
 * Ignore merge commits
 * @param locality
 * @constructor
 */
var FILTER_NO_MERGE_COMMIT = function (locality) {
    return locality.parentHashes.length <= 1;
};
exports.FILTER_NO_MERGE_COMMIT = FILTER_NO_MERGE_COMMIT;
/**
 * Ignore CommitPaths which are testfiles
 * @param commitPath
 * @param testFileMatcher
 * @constructor
 */
var FILTER_NO_TEST_FILE = function (commitPath, testFileMatcher) {
    var _a;
    return !((_a = commitPath.path) === null || _a === void 0 ? void 0 : _a.path.match(testFileMatcher));
};
exports.FILTER_NO_TEST_FILE = FILTER_NO_TEST_FILE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7R0FRRztBQUNILHVGQUFrRztBQUczRixJQUFNLHlCQUF5QixHQUFHLFVBQUMsUUFBZ0I7SUFDdEQsSUFBTSxtQkFBbUIsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVELElBQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FBQTtBQUpZLFFBQUEseUJBQXlCLDZCQUlyQztBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSSxJQUFNLDhCQUE4QixHQUFHLFVBQUMsTUFBYyxFQUFFLGVBQXdCO0lBQ25GLElBQU0saUJBQWlCLEdBQUcsVUFBQyxJQUFtQztRQUMxRCxPQUFPLGVBQWUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BFLENBQUMsQ0FBQTtJQUVELElBQU0sZ0JBQWdCLEdBQUcsVUFBQyxJQUFtQztRQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksK0NBQVcsQ0FBQyxPQUFPLENBQUM7SUFDNUMsQ0FBQyxDQUFBO0lBRUQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDakMsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELElBQU0seUJBQXlCLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8seUJBQXlCLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUE7QUFiWSxRQUFBLDhCQUE4QixrQ0FhMUM7QUFFRDs7OztHQUlHO0FBQ0ksSUFBTSxzQkFBc0IsR0FBRyxVQUFDLFFBQWdCO0lBQ25ELE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQTtBQUZZLFFBQUEsc0JBQXNCLDBCQUVsQztBQUVEOzs7OztHQUtHO0FBQ0ksSUFBTSxtQkFBbUIsR0FBRyxVQUFDLFVBQXNCLEVBQUUsZUFBdUI7O0lBQy9FLE9BQU8sQ0FBQyxDQUFBLE1BQUEsVUFBVSxDQUFDLElBQUksMENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQSxDQUFBO0FBQ3hELENBQUMsQ0FBQTtBQUZZLFFBQUEsbUJBQW1CLHVCQUUvQiJ9