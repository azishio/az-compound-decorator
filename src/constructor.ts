import { AzDecorator, AzDecoratorOption, HaveEverythingOption, SignType } from "./types";

const OptionError = (
  type: "nameIsEmptyStr" | "parentNameIsEmptyArr" | "duplicateParentName" | "InvalidParentName",
  option: AzDecoratorOption
) => {
  switch (type) {
    case "nameIsEmptyStr":
      return `AzCompoundDecorator:
An empty string is specified as the "name".
All options for this Decorator are ignored.
Decorator:${JSON.stringify(option)}`;
    case "parentNameIsEmptyArr":
      return `AzCompoundDecorator:
An element of the array "parentName" does not exist.
Decorator:${JSON.stringify(option)}`;
    case "duplicateParentName":
      return `AzCompoundDecorator:
There is a duplicate element in parentName.
Decorator:${JSON.stringify(option)}`;
    case "InvalidParentName":
      return `AzCompoundDecorator:
The "name" in parentName does not exist or was not previously defined.
Only the relevant element of "parentName" will be invalidated.
Decorator:${JSON.stringify(option)}`;
    default:
      // eslintが怒らないように
      return "";
  }
};

const checkAndReturnOptions = (
  decorators: AzDecorator[],
  defaultSymbolType: SignType
): HaveEverythingOption[] => {
  const checkedName: string[] = [];
  // いろいろ改変するので独立させておく
  const decArr = decorators;

  const defaultProp = {
    name: null,
    parentName: null,
    signType: defaultSymbolType,
  };

  return decArr.map((dec, decIndex) => {
    const { option } = dec;
    if (!option) return defaultProp;

    const newProp: HaveEverythingOption = {
      ...defaultProp,
      name: option.name,
    };

    if (option.name === "") {
      console.error(OptionError("nameIsEmptyStr", option));
      delete decArr[decIndex].option;
      return defaultProp;
    }

    if (option.parentName) {
      const parentName = option.parentName as string[];
      const illegalIndex: number[] = [];
      if (parentName.length === 0) {
        console.warn(OptionError("parentNameIsEmptyArr", option));
        delete decArr[decIndex].option;
      } else {
        if (
          parentName.every((v, ii) => {
            const judge = parentName.indexOf(v) === ii;
            if (!judge) {
              illegalIndex.push(ii);
            }
            return judge;
          })
        ) {
          console.warn(OptionError("duplicateParentName", option));
        }
        if (
          parentName.every((v, ii) => {
            const judgment = checkedName.includes(v) || v === "_undecorated";
            if (!judgment) {
              illegalIndex.push(ii);
            }
            return judgment;
          })
        ) {
          console.error(OptionError("InvalidParentName", option));
        }
      }
      newProp.parentName = parentName.filter((v, i) => !illegalIndex.includes(i));
    }

    if (option.signType) newProp.signType = option.signType;

    checkedName.push(option.name);
    return newProp;
  });
};
export default checkAndReturnOptions;
