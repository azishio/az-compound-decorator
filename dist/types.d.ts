import { DraftDecorator } from "draft-js";
type AzDecoratorOption = {
    name: string;
    parentName?: string[];
    signType?: SignType;
};
type AzDecorator = DraftDecorator & {
    option?: AzDecoratorOption;
};
type DecoratorRange = {
    start: number;
    end: number;
};
type DecoratorKey = {
    decoratorIndex: number;
    id: number;
};
type SignType = "same" | "endless";
type HaveEverythingOption = {
    name: string | null;
    parentName: string[] | null;
    signType: SignType;
};
export type { AzDecoratorOption, AzDecorator, DecoratorRange, HaveEverythingOption, DecoratorKey, SignType, };
