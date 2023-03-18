import { DraftDecorator } from "draft-js";

type AzDecoratorOption = {
  name: string; // Other than "_undecorated"
  parentName?: string[];
  signType?: SignType;
};

type AzDecorator = DraftDecorator & {
  option?: AzDecoratorOption;
};

// symbolからsignに変更新しいプログラムは全部signに置き換え、使用箇所がなくなり次第削除
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
  name: string | null; // Other than "_undecorated"
  parentName: string[] | null;
  signType: SignType;
};



export type {
  AzDecoratorOption,
  AzDecorator,
  DecoratorRange,
  HaveEverythingOption,
  DecoratorKey,
  SignType,
};
