import { Activateable } from "./Activateable";
import { ItemStack } from './ItemStack';

export class Item extends Activateable {
  constructor(props: {
        Id: number,
        CanonicalId:string,
        Name?: string,
        Description?: string,
        BaseValue?: number,
        Quality?: number,
        Color?: ("White" | "Black" | "Red" | "Yellow" | "Green" | "Blue" | "None"),
        Extra?:any
      }) {
    super();
    Object.assign(this,props);
  }

  toItemStack(amount:number) {
    var is = new ItemStack();
    is.Amount=amount;
    is.Item=this;
    is.Parent=this;
    return is;
  }
}