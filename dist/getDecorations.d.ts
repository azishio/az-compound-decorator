import { ContentBlock, ContentState } from "draft-js";
import { AzDecorator, DecoratorRange, HaveEverythingOption } from "./types";
declare const collectLocationOfSign: (decorators: AzDecorator[], block: ContentBlock, contentState: ContentState, options: HaveEverythingOption[]) => number[][];
declare const toDecoratorRange: (signsLocation: number[][], options: HaveEverythingOption[], blockLength: number) => DecoratorRange[][];
declare const toKeyList: (decoratorsRanges: DecoratorRange[][], blockLength: number) => (string | null)[];
export { collectLocationOfSign, toDecoratorRange, toKeyList };
