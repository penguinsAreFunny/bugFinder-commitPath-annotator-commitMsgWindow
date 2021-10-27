import {inject, injectable, optional} from "inversify";
import {BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES} from "./TYPES";
import {Annotator, LocalityMap, SHARED_TYPES} from "bugfinder-framework";
import {CommitPath, PredecessorsUnique} from "bugfinder-localityrecorder-commitpath";
import {Logger} from "ts-log";
import _ from "underscore"

@injectable()
export class CommitPathsPredecessorsAnnotator implements Annotator<CommitPath, number> {
    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.commitPathAnnotator)
    commitPathAnnotator: Annotator<CommitPath, number>

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.n)
    n: number

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.upToN)
    upToN: boolean

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGPREDECESSORS_TYPES.uniqueMode)
    uniqueMode: boolean

    @optional() @inject(SHARED_TYPES.logger)
    logger: Logger

    /**
     * If upToN is false the return value does not annotate localities which have less than n predecessors
     * Therefore the return value has undefined values for these localities
     * @param localitiesToAnnotate
     * @param allLocalities
     */
    annotate(localitiesToAnnotate: CommitPath[], allLocalities: CommitPath[]): LocalityMap<CommitPath, number> {
        const map = new LocalityMap<CommitPath, number>()

        if (this.uniqueMode) {
            CommitPath.setPredecessorDelegation(new PredecessorsUnique(this.logger))
        }

        const nPredecessorsMap: LocalityMap<CommitPath, CommitPath[]> =
            CommitPath.getNPredecessorsMap(localitiesToAnnotate, this.n, this.upToN, allLocalities)

        for (let i = 0; i < localitiesToAnnotate.length; i++) {
            const loc = localitiesToAnnotate[i]
            const nPredecessors = nPredecessorsMap.getVal(loc)

            // upToN == false => locality has less than n predecessors
            if (nPredecessors == null)
                continue

            // annotations of nPredecessors
            const annotations = this.commitPathAnnotator.annotate(nPredecessors)

            // sum of all annotations of the nPredecessors
            const annotation = annotations.toArray()
                .map(el => {
                    return el.val
                })
                .reduce((el1, el2) => {
                    return el1 + el2
                })

            map.set(loc, annotation)
        }

        const annoValues = map.toArray().map(el => {
            return el.val
        })

        this.logger?.info("Annotation count: ", _.countBy(annoValues, (num) => {
            return num
        }))

        return map;
    }

}