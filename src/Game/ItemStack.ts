import { Activateable } from "./Activateable.js";
import { Item } from "./Item.js";


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
  getCanonicalId() { return this.Item.CanonicalId;}

}