const Node = famous.core.Node;

class AccountBox extends Node {
  constructor(){
    super();
    this.setSizeMode('default', 'render').
        setProportionalSize(0.15, null).
        setAlign(0.85, null);
  }
}


if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.AccountBox = AccountBox;
FView.wrap('AccountBox', famous.customLayouts.AccountBox);
