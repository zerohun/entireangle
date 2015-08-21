const Node = famous.core.Node;

class WindowManager extends Node {
  addChild(node){
    super.addChild(node);
    if(node.isHidden){
      node.hide();
    }
  }
}


if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.WindowManager = WindowManager;
FView.wrap('WindowManager', famous.customLayouts.WindowManager);
