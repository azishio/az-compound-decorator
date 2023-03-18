import { ContentBlock, ContentState, DraftDecoratorType } from "draft-js";
import Immutable from "immutable";
import { collectLocationOfSign, toDecoratorRange, toKeyList } from "./getDecorations";

import { AzDecorator, DecoratorKey, DecoratorRange, HaveEverythingOption, SignType } from "./types";
import checkAndReturnOptions from "./constructor";
/* eslint max-classes-per-file: 0 */

const { List } = Immutable;

export default class CompoundDecorator implements DraftDecoratorType {
  private readonly decorators: Array<AzDecorator>;

  private readonly option: HaveEverythingOption[];

  private readonly callback: (v: DecoratorRange[][]) => DecoratorRange[][];

  constructor(
    decorator: Array<AzDecorator>,
    defaultSignType: SignType = "same",
    callback = (v: DecoratorRange[][]) => v
  ) {
    this.decorators = [...decorator];
    this.option = checkAndReturnOptions(this.decorators, defaultSignType);
    this.callback = callback;
  }

  getDecorations(block: ContentBlock, contentState: ContentState): Immutable.List<string> {
    const blockLength = block.getText().length;

    const signLocation = collectLocationOfSign(this.decorators, block, contentState, this.option);

    const decoratorRange = toDecoratorRange(signLocation, this.option, blockLength);

    const newDecoratorRange = this.callback(decoratorRange);

    // 本当は(string|null)[]
    // コードを読む限りCompositeDecoratorにもnullが"decorator無し"という意味で存在していると思う
    const keyList = toKeyList(newDecoratorRange, blockLength) as string[];

    return List(keyList);
  }

  // _decoration からコンポーネントが読めれば良い
  getComponentForKey(stringKey: string) {
    // ネストの深いところから組み立てたい
    const keyArr: DecoratorKey[] = JSON.parse(stringKey).reverse();

    function Dummy(props: { [prop: string]: any }) {
      const { children } = props;
      return <span>{children}</span>;
    }

    const Decorators = keyArr.reduce((CD, key) => {
      const { decoratorIndex, id } = key;
      const Decorator = this.decorators[decoratorIndex].component;
      const decoratorProps = this.decorators[decoratorIndex].props || {};
      return function AzCompoundDecoratorWrapper(props) {
        return (
          <Decorator {...props} {...decoratorProps} decoratorId={id}>
            <CD {...props} />
          </Decorator>
        );
      };
    }, Dummy);

    return function AzCompoundDecoratorWrapper(props: { [prop: string]: any }) {
      const { children } = props;
      return <Decorators {...props}>{children}</Decorators>;
    };
  }

  // draft-jsが要求してるから仕方ない。
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  getPropsForKey(stringKey: string) {
    // 全部必要になるので、getComponentForKeyで_decoratorから取得する
    return {};
  }
}
