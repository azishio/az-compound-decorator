import { AzDecorator, AzDecoratorOption, HaveEverythingOption, SignType } from "./types";

const OptionError = (
  type: "nameIsEmptyStr" | "parentNameIsEmptyArr" | "duplicateParentName" | "invalidParentName",
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
    case "invalidParentName":
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
): [HaveEverythingOption[], { [name: string]: number }] => {
  const checkedName: string[] = [];
  // いろいろ改変するので独立させておく
  const decArr = decorators;

  const defaultProp = {
    name: null,
    parentName: null,
    signType: defaultSymbolType,
  };

  const options = decArr.map((dec, decIndex) => {
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

    const { parentName } = option;
    if (parentName) {
      if (parentName.length === 0) {
        console.warn(OptionError("parentNameIsEmptyArr", option));
        newProp.parentName = null;
      } else {
        const nonDuplicateParentName = [...new Set(parentName)];

        if (nonDuplicateParentName.length !== parentName.length) {
          console.warn(OptionError("duplicateParentName", option));
        }

        newProp.parentName = nonDuplicateParentName.filter(v => checkedName.includes(v));
        if (newProp.parentName.length !== nonDuplicateParentName.length) {
          console.error(OptionError("invalidParentName", option));
        }
      }
    }

    if (option.signType) newProp.signType = option.signType;

    checkedName.push(option.name);
    return newProp;
  });

  const nameMap: { [name: string]: number } = Object.fromEntries(
    options.map((v, i) => [v.name, i])
  );

  return [options, nameMap];
};
export default checkAndReturnOptions;
