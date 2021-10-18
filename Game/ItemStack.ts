import { Activateable } from "./Activateable";
import { Item } from "./Item";


export class ItemStack extends Activateable {
  Item: Item;
  Amount: number;

  constructor() {
    super();
    this.Parent = this.Item;
  }

  getName() { return this.Item.Name;}
  getDescription() { return this.Item.Description;}
  getId() { return this.Item.Id;}
}