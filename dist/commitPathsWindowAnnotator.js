"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPathsWindowAnnotator = void 0;
var inversify_1 = require("inversify");
var bugfinder_framework_1 = require("bugfinder-framework");
var bugfinder_localityrecorder_commitpath_1 = require("bugfinder-localityrecorder-commitpath");
var underscore_1 = __importDefault(require("underscore"));
var TYPES_1 = require("./TYPES");
var CommitPathsWindowAnnotator = /** @class */ (function () {
    function CommitPathsWindowAnnotator() {
    }
    /**
     * If upToN is false the return value does not annotate localities which have less than n predecessors
     * Therefore the return value has undefined values for these localities
     * @param localitiesToAnnotate
     * @param allLocalities
     */
    CommitPathsWindowAnnotator.prototype.annotate = function (localitiesToAnnotate, allLocalities) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var map, nPredecessorsMap, nPostdecessorsMap, i, loc, nPredecessors, nPostdecessors, cur, predAnnotation, postAnnotation, curAnnotation, _b, annotation, annoValues;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        map = new bugfinder_framework_1.LocalityMap();
                        bugfinder_localityrecorder_commitpath_1.CommitPath.logger = this.logger;
                        nPredecessorsMap = bugfinder_localityrecorder_commitpath_1.CommitPath.getNPredecessorsMap(localitiesToAnnotate, this.nPred, this.upToN, this.uniqueModePre, allLocalities);
                        nPostdecessorsMap = bugfinder_localityrecorder_commitpath_1.CommitPath.getNPostdecessorMap(localitiesToAnnotate, this.nPost, this.upToN, this.uniqueModePost, allLocalities);
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < localitiesToAnnotate.length)) return [3 /*break*/, 8];
                        loc = localitiesToAnnotate[i];
                        nPredecessors = nPredecessorsMap.getVal(loc);
                        nPostdecessors = nPostdecessorsMap.getVal(loc);
                        //@formatter:on
                        // upToN == false => locality has less than n predecessors
                        if (nPredecessors == null && nPostdecessors == null)
                            return [3 /*break*/, 7];
                        cur = localitiesToAnnotate[i];
                        return [4 /*yield*/, this.annotationsSum(nPredecessors.slice(1))];
                    case 2:
                        predAnnotation = _c.sent();
                        return [4 /*yield*/, this.annotationsSum(nPostdecessors.slice(1))];
                    case 3:
                        postAnnotation = _c.sent();
                        if (!this.useCurrent) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.commitPathAnnotator.annotate([cur])];
                    case 4:
                        _b = (_c.sent()).getVal(cur);
                        return [3 /*break*/, 6];
                    case 5:
                        _b = 0;
                        _c.label = 6;
                    case 6:
                        curAnnotation = _b;
                        annotation = predAnnotation + postAnnotation + curAnnotation;
                        // @formatter:on
                        map.set(loc, annotation);
                        _c.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 1];
                    case 8:
                        annoValues = map.toArray().map(function (el) {
                            return el.val;
                        });
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Annotation count: ", underscore_1.default.countBy(annoValues, function (num) {
                            return num;
                        }));
                        return [2 /*return*/, map];
                }
            });
        });
    };
    CommitPathsWindowAnnotator.prototype.annotationsSum = function (localities) {
        return __awaiter(this, void 0, void 0, function () {
            var annotations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (localities == null || localities.length == 0)
                            return [2 /*return*/, 0];
                        return [4 /*yield*/, this.commitPathAnnotator.annotate(localities)
                            // sum of all annotations of the nPredecessors
                        ];
                    case 1:
                        annotations = _a.sent();
                        // sum of all annotations of the nPredecessors
                        return [2 /*return*/, annotations.toArray()
                                .map(function (el) {
                                return el.val;
                            })
                                .reduce(function (el1, el2) {
                                return el1 + el2;
                            })];
                }
            });
        });
    };
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.commitPathAnnotator),
        __metadata("design:type", Object)
    ], CommitPathsWindowAnnotator.prototype, "commitPathAnnotator", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.nPre),
        __metadata("design:type", Number)
    ], CommitPathsWindowAnnotator.prototype, "nPred", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.nPost),
        __metadata("design:type", Number)
    ], CommitPathsWindowAnnotator.prototype, "nPost", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.upToN),
        __metadata("design:type", Boolean)
    ], CommitPathsWindowAnnotator.prototype, "upToN", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.uniqueModePre),
        __metadata("design:type", Boolean)
    ], CommitPathsWindowAnnotator.prototype, "uniqueModePre", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.uniqueModePost),
        __metadata("design:type", Boolean)
    ], CommitPathsWindowAnnotator.prototype, "uniqueModePost", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_ANNOTATOR_COMMITMSGWINDOW_TYPES.useCurrent),
        __metadata("design:type", Boolean)
    ], CommitPathsWindowAnnotator.prototype, "useCurrent", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger),
        __metadata("design:type", Object)
    ], CommitPathsWindowAnnotator.prototype, "logger", void 0);
    CommitPathsWindowAnnotator = __decorate([
        (0, inversify_1.injectable)()
    ], CommitPathsWindowAnnotator);
    return CommitPathsWindowAnnotator;
}());
exports.CommitPathsWindowAnnotator = CommitPathsWindowAnnotator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aHNXaW5kb3dBbm5vdGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWl0UGF0aHNXaW5kb3dBbm5vdGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXVEO0FBQ3ZELDJEQUF5RTtBQUN6RSwrRkFBaUU7QUFFakUsMERBQTBCO0FBQzFCLGlDQUE2RTtBQUc3RTtJQUFBO0lBa0dBLENBQUM7SUF6RUc7Ozs7O09BS0c7SUFDRyw2Q0FBUSxHQUFkLFVBQWUsb0JBQWtDLEVBQUUsYUFBMkI7Ozs7Ozs7d0JBR3BFLEdBQUcsR0FBRyxJQUFJLGlDQUFXLEVBQXNCLENBQUE7d0JBRWpELGtEQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7d0JBRXpCLGdCQUFnQixHQUNsQixrREFBVSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQzNELElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQTt3QkFFaEQsaUJBQWlCLEdBQ25CLGtEQUFVLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUN2RSxJQUFJLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFBO3dCQUdsQyxDQUFDLEdBQUcsQ0FBQzs7OzZCQUFFLENBQUEsQ0FBQyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQTt3QkFFckMsR0FBRyxHQUFjLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUN4QyxhQUFhLEdBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUM3QyxjQUFjLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FB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