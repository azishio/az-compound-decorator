/// <reference types="react" />
import { ContentBlock, ContentState, DraftDecoratorType } from "draft-js";
import Immutable from "immutable";
import { AzDecorator, DecoratorRange, SignType } from "./types";
export default class CompoundDecorator implements DraftDecoratorType {
    private readonly decorators;
    private readonly option;
    private readonly callback;
    constructor(decorator: Array<AzDecorator>, defaultSignType?: SignType, callback?: (v: DecoratorRange[][]) => DecoratorRange[][]);
    getDecorations(block: ContentBlock, contentState: ContentState): Immutable.List<string>;
    getComponentForKey(stringKey: string): (props: {
        [prop: string]: any;
    }) => JSX.Element;
    getPropsForKey(stringKey: string): {};
}
