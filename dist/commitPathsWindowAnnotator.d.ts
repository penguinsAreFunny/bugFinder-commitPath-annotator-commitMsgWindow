import { Annotator, LocalityMap } from "bugfinder-framework";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { Logger } from "ts-log";
export declare class CommitPathsWindowAnnotator implements Annotator<CommitPath, number> {
    commitPathAnnotator: Annotator<CommitPath, number>;
    nPred: number;
    nPost: number;
    upToN: boolean;
    uniqueModePre: boolean;
    uniqueModePost: boolean;
    useCurrent: boolean;
    logger: Logger;
    /**
     * If upToN is false the return value does not annotate localities which have less than n predecessors
     * Therefore the return value has undefined values for these localities
     * @param localitiesToAnnotate
     * @param allLocalities
     */
    annotate(localitiesToAnnotate: CommitPath[], allLocalities: CommitPath[]): Promise<LocalityMap<CommitPath, number>>;
    private annotationsSum;
}
