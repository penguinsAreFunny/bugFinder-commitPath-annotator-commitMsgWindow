# Description
This package is used as a Annotator for CommitPaths of the machine learning pipeline of the
[bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme) or 
([npm:bugfinder-framework](https://www.npmjs.com/package/bugfinder-framework)). 
You can use this package to annotate (create classes/labels) for your localities of type CommitPath.
You can define a regular expression for test-files which will be ignored.
A CommitPath is marked as a fix-indicating CommitPath if the Commit has a corrective message, touches less or equal
than two files, is not a merge commit and commit does not affect test files.

 Corrective commit message:
 
     Case insensitive check for corrective keywords: ["bug", "fix", "error", "fail"] in commit message (rawBody)
     
     Keywords to identify corrective commits
     Ref: A. Mockus and L. G. Votta, Identifying Reasons for Software Changes Using Historic Databases
     CORRECTIVE_KEYWORDS = ['bug', 'fix', 'error', 'fail']
 
 Less or equal two files:
 
      Commits containing more than two not test files are discarded.
      Test and deleted files are ignored. Test files usually start with test or tests or end with spec.* or test.*.
      
      Inspired by
      Thumb rule to identify corrective commits
      Ref: T. J. Ostrand, E. J. Weyuker and R. M. Bell.
      „Predicting the location and number of faults in large software systems“.
      In: IEEE Transactions on Software Engineering 31.4 (2005), Pages 340–355 [Page 5]
      commits which affect more than 2 files are not classified as corrective commits

# Prerequisites
You need to begin with understanding the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme)
and installing it:
1. 
    ```npm i bugfinder-framework```

 
    
# Usage
This package is not intended to be used independently, but feel free to do so. Instead of Dependency Injection you can
just create instances of the Annotator with ```new CommitPathsPredecessorsAnnotator(...)```.

The following example read CommitPaths from a MongoDB and annotates them with consideration of up to 5 predecessor
CommitPaths
1. ```    
    npm i -D bugfinder-commitpath-annotator-commitmsgpredecessors
    npm i -D bugfinder-commitpath-annotator-commitmsg
    npm i -D bugfinder-commitpath-db-mongodb
    ```
2. [MongoDB-Prerequisites](https://www.npmjs.com/package/bugfinder-commitpath-db-mongodb)
3. You can create your localities with [bugfinder-localityrecorder-commitpath](https://www.npmjs.com/package/bugfinder-localityrecorder-commitpath).

inversify.config.ts
```typescript
import {
    AnnotationFactory,
    Annotator,
    ANNOTATOR_TYPES,
    DB,
} from "bugfinder-framework";
import {MongoDBConfig} from "bugfinder-commit-db-mongodb";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_DB_COMMITPATH_MONGODB_TYPES, CommitPathsMongoDB} from "bugfinder-commitpath-db-mongodb";
import {
    BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSG_TYPES, CommitPathsAnnotator,
} from "bugfinder-commitpath-annotator-commitmsg";
import {annotatorContainer} from "bugfinder-framework-defaultContainer";
import {CommitPathsPredecessorsAnnotator} from "bugfinder-commitpath-annotator-commitmsgpredecessors";
import {BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES}
    from "bugfinder-commitpath-annotator-commitmsgpredecessors";

const container = annotatorContainer;
const mongoDBConfig: MongoDBConfig = {
    url: "mongodb://localhost:27017",
    dbName: "TEST"
}
const testFileMatcher = /(test?\/.*\.*)/

// binding Annotator and its dependencies
container.bind<Annotator<CommitPath, number>>(ANNOTATOR_TYPES.annotator).to(CommitPathsPredecessorsAnnotator)
container.bind<number>(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.n).toConstantValue(5)
container.bind<boolean>(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.upToN).toConstantValue(true)
container.bind<Annotator<CommitPath, number>>(
    BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.commitPathAnnotator).to(CommitPathsAnnotator)
container.bind<RegExp>(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSG_TYPES.testFileMatcher).toConstantValue(testFileMatcher)

// binding DB and its dependencies
container.bind<DB<CommitPath, number, any>>(ANNOTATOR_TYPES.db).to(CommitPathsMongoDB)
container.bind<MongoDBConfig>(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig).toConstantValue(mongoDBConfig)

// binding AnnotationFactory
container.bind<AnnotationFactory<CommitPath, number>>(ANNOTATOR_TYPES.annotationFactory).to(AnnotationFactory)


export {container};
```
main.ts
```typescript
import "reflect-metadata";
import {container} from "./inversify.config"
import {
    AnnotationFactory, ANNOTATOR_TYPES,
} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";

async function topLevelAwaitWrapper() {
    const annotationFactory =
        container.get<AnnotationFactory<CommitPath, number>>(ANNOTATOR_TYPES.annotationFactory)
    const annotator = annotationFactory.createAnnotator();
    const db = annotationFactory.createDB();

    const localities = await db.readLocalities("CommitPaths")
    const annotations = annotator.annotate(localities)
    await db.writeAnnotations(annotations, "Annotations")
}

topLevelAwaitWrapper();
```