"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKeyList = exports.toDecoratorRange = exports.collectLocationOfSign = void 0;
const collectLocationOfSign = (decorators, block, contentState, options) => {
    const signsLocation = Array(decorators.length);
    for (let i = 0; i < decorators.length; i++) {
        signsLocation[i] = Array(block.getText().length);
    }
    decorators.forEach((decorator, decoratorIndex) => {
        const { strategy } = decorators[decoratorIndex];
        const callback = (start, end) => {
            if (signsLocation.every(v => !v[start])) {
                signsLocation[decoratorIndex][start] = start;
            }
            if (options[decoratorIndex].signType === "same") {
                const endMinusOne = end - 1;
                if (signsLocation.every(v => !v[endMinusOne])) {
                    signsLocation[decoratorIndex][endMinusOne] = endMinusOne;
                }
            }
        };
        strategy(block, callback, contentState);
    });
    return signsLocation.map(v => v.filter(() => true));
};
exports.collectLocationOfSign = collectLocationOfSign;
const toDecoratorRange = (signsLocation, options, blockLength) => {
    const depthMap = Array(blockLength).fill("");
    return signsLocation.map((decoratorSigns /* Decoratorごとのsign */, decoratorIndex) => {
        let id = 0;
        const decoratorsRanges = [];
        decoratorSigns.forEach((signOffset, signIndex) => {
            // ここで読んでいるときにnullになることはない
            const depth = depthMap[signOffset];
            const startSignOffset = signOffset;
            decoratorSigns[signIndex] = null;
            let endSignIndex;
            let endSignOffset;
            if (options[decoratorIndex].signType === "same") {
                endSignIndex = decoratorSigns.findIndex(v => v && depthMap[v] === depth);
                endSignOffset = endSignIndex !== -1 ? decoratorSigns[endSignIndex] : null;
                delete decoratorSigns[endSignIndex];
            }
            else {
                const tmp = depthMap.findIndex((v, i) => i > startSignOffset && v !== depth);
                endSignOffset = tmp !== -1 ? tmp - 1 : null;
            }
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
    });
};
exports.toDecoratorRange = toDecoratorRange;
const toKeyList = (decoratorsRanges, blockLength) => {
    const keyList = Array(blockLength);
    for (let i = 0; i < blockLength; i++) {
        keyList[i] = [];
    }
    decoratorsRanges.forEach((decoratorRanges, decoratorIndex) => decoratorRanges.forEach((decoratorRange, id) => {
        const { start, end } = decoratorRange;
        for (let i = start; i <= end; i++) {
            keyList[i].push({ decoratorIndex, id });
        }
    }));
    return keyList.map(v => (v.length === 0 ? null : JSON.stringify(v)));
};
exports.toKeyList = toKeyList;
//# sourceMappingURL=getDecorations.js.map