import { ContentBlock, ContentState } from "draft-js";
import { AzDecorator, DecoratorKey, DecoratorRange, HaveEverythingOption } from "./types";

const collectLocationOfSign = (
  decorators: AzDecorator[],
  block: ContentBlock,
  contentState: ContentState
) => {
  const signsLocation: number[][] = Array(decorators.length);

  for (let i = 0; i < decorators.length; i++) {
    signsLocation[i] = Array(block.getText().length);
  }

  decorators.forEach((decorator, decoratorIndex) => {
    const { strategy } = decorators[decoratorIndex];
    const callback = (start: number, end: number) => {
      if (signsLocation.every(v => !v[start])) {
        signsLocation[decoratorIndex][start] = start;
      }

      const endMinusOne = end - 1;
      if (signsLocation.every(v => !v[endMinusOne])) {
        signsLocation[decoratorIndex][endMinusOne] = endMinusOne;
      }
    };
    strategy(block, callback, contentState);
  });

  return signsLocation.map(v => v.filter(() => true));
};

const toDecoratorRange = (
  signsLocation: number[][],
  options: HaveEverythingOption[],
  blockLength: number
) => {
  const depthMap: string[] = Array(blockLength).fill("");

  return signsLocation.map(
    (decoratorSigns: (number | null)[] /* Decoratorごとのsign */, decoratorIndex) => {
      let id = 0;

      const decoratorsRanges: DecoratorRange[] = [];

      // parentチェック

      decoratorSigns.forEach((signOffset, signIndex) => {
        // ここで読んでいるときにnullになることはない
        const depth = depthMap[<number>signOffset];
        const startSignOffset = signOffset as number;

        decoratorSigns[signIndex] = null;

        const endSignIndex = decoratorSigns.findIndex(v => v && depthMap[v] === depth);
        const endSignOffset = endSignIndex !== -1 ? decoratorSigns[endSignIndex] : null;
        delete decoratorSigns[endSignIndex];

        if (endSignOffset) {
          decoratorsRanges.push({
            start: startSignOffset,
            end: endSignOffset,
          });

          for (let i = startSignOffset; i <= endSignOffset; i++) {
            depthMap[i] += `"${decoratorIndex}-${id}"`;
          }
          id++;
        }
      });

      return decoratorsRanges;
    }
  );
};

const toKeyList = (decoratorsRanges: DecoratorRange[][], blockLength: number) => {
  const keyList: DecoratorKey[][] = Array(blockLength);
  for (let i = 0; i < blockLength; i++) {
    keyList[i] = [];
  }

  decoratorsRanges.forEach((decoratorRanges, decoratorIndex) =>
    decoratorRanges.forEach((decoratorRange, id) => {
      const { start, end } = decoratorRange;
      for (let i = start; i <= end; i++) {
        keyList[i].push({ decoratorIndex, id });
      }
    })
  );

  return keyList.map(v => (v.length === 0 ? null : JSON.stringify(v)));
};

export { collectLocationOfSign, toDecoratorRange, toKeyList };
