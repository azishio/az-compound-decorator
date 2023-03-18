"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const immutable_1 = __importDefault(require("immutable"));
const getDecorations_1 = require("./getDecorations");
const constructor_1 = __importDefault(require("./constructor"));
/* eslint max-classes-per-file: 0 */
const { List } = immutable_1.default;
class CompoundDecorator {
    constructor(decorator, defaultSignType = "same", callback = (v) => v) {
        this.decorators = [...decorator];
        this.option = (0, constructor_1.default)(this.decorators, defaultSignType);
        this.callback = callback;
    }
    getDecorations(block, contentState) {
        const blockLength = block.getText().length;
        const signLocation = (0, getDecorations_1.collectLocationOfSign)(this.decorators, block, contentState, this.option);
        const decoratorRange = (0, getDecorations_1.toDecoratorRange)(signLocation, this.option, blockLength);
        const newDecoratorRange = this.callback(decoratorRange);
        // 本当は(string|null)[]
        // コードを読む限りCompositeDecoratorにもnullが"decorator無し"という意味で存在していると思う
        const keyList = (0, getDecorations_1.toKeyList)(newDecoratorRange, blockLength);
        return List(keyList);
    }
    // _decoration からコンポーネントが読めれば良い
    getComponentForKey(stringKey) {
        // ネストの深いところから組み立てたい
        const keyArr = JSON.parse(stringKey).reverse();
        function Dummy(props) {
            const { children } = props;
            return (0, jsx_runtime_1.jsx)("span", { children: children });
        }
        const Decorators = keyArr.reduce((CD, key) => {
            const { decoratorIndex, id } = key;
            const Decorator = this.decorators[decoratorIndex].component;
            const decoratorProps = this.decorators[decoratorIndex].props || {};
            return function AzCompoundDecoratorWrapper(props) {
                return ((0, jsx_runtime_1.jsx)(Decorator, { ...props, ...decoratorProps, decoratorId: id, children: (0, jsx_runtime_1.jsx)(CD, { ...props }) }));
            };
        }, Dummy);
        return function AzCompoundDecoratorWrapper(props) {
            const { children } = props;
            return (0, jsx_runtime_1.jsx)(Decorators, { ...props, children: children });
        };
    }
    // draft-jsが要求してるから仕方ない。
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
    getPropsForKey(stringKey) {
        // 全部必要になるので、getComponentForKeyで_decoratorから取得する
        return {};
    }
}
exports.default = CompoundDecorator;
//# sourceMappingURL=index.js.map