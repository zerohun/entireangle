const Node = famous.core.Node;

class TabMenuLayout extends Node {
  constructor(){
    super();
  }
  addChild(child){
    let i = this.getChildren().length;
    child.setSizeMode('default', 'render').
      setProportionalSize(0.15, null).
      setAlign(0.15 * i, null).
      setMountPoint(0.0, 0.5);

    super.addChild(child);
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.TabMenuLayout = TabMenuLayout;
FView.wrap('TabMenuLayout', famous.customLayouts.TabMenuLayout);
