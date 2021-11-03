import {inject, injectable, optional} from "inversify";
import {Annotator, LocalityMap, SHARED_TYPES} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {Logger} from "ts-log";
import _ from "underscore"
import {BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES} from "./TYPES";

@injectable()
export class CommitPathsWindowAnnotator implements Annotator<CommitPath, number> {
    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.commitPathAnnotator)
    commitPathAnnotator: Annotator<CommitPath, number>

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.nPre)
    nPred: number

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.nPost)
    nPost: number

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.upToN)
    upToN: boolean

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.uniqueModePre)
    uniqueModePre: boolean

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.uniqueModePost)
    uniqueModePost: boolean

    @inject(BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.useCurrent)
    useCurrent: boolean

    @optional() @inject(SHARED_TYPES.logger)
    logger: Logger

    /**
     * If upToN is false the return value does not annotate localities which have less than n predecessors
     * Therefore the return value has undefined values for these localities
     * @param localitiesToAnnotate
     * @param allLocalities
     */
    async annotate(localitiesToAnnotate: CommitPath[], allLocalities: CommitPath[]):
        Promise<LocalityMap<CommitPath, number>> {

        const map = new LocalityMap<CommitPath, number>()

        CommitPath.logger = this.logger

        const nPredecessorsMap: LocalityMap<CommitPath, CommitPath[]> =
            CommitPath.getNPredecessorsMap(localitiesToAnnotate, this.nPred,
                this.upToN, this.uniqueModePre, allLocalities)

        const nPostdecessorsMap: LocalityMap<CommitPath, CommitPath[]> =
            CommitPath.getNPostdecessorMap(localitiesToAnnotate, this.nPost, this.upToN,
                this.uniqueModePost, allLocalities)


        for (let i = 0; i < localitiesToAnnotate.length; i++) {
            // @formatter:off
            const loc            = localitiesToAnnotate[i]
            const nPredecessors  = nPredecessorsMap.getVal(loc)
            const nPostdecessors = nPostdecessorsMap.getVal(loc)
            //@formatter:on

            // upToN == false => locality has less than n predecessors
            if (nPredecessors == null && nPostdecessors == null)
                continue

            // annotations of predecessors and postdecessors
            // @formatter:off
            const cur            = localitiesToAnnotate[i]
            const predAnnotation = await this.annotationsSum(nPredecessors.slice(1))
            const postAnnotation = await this.annotationsSum(nPostdecessors.slice(1))
            const curAnnotation  = this.useCurrent?
                (await this.commitPathAnnotator.annotate([cur])).getVal(cur): 0
            const annotation     = predAnnotation + postAnnotation + curAnnotation
            // @formatter:on

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

    private async annotationsSum(localities: CommitPath[]): Promise<number> {
        if (localities == null || localities.length == 0)
            return 0

        const annotations = await this.commitPathAnnotator.annotate(localities)

        // sum of all annotations of the nPredecessors
        return annotations.toArray()
            .map(el => {
                return el.val
            })
            .reduce((el1, el2) => {
                return el1 + el2
            })
    }

}
