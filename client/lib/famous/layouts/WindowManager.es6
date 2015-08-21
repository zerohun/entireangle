const Node = famous.core.Node;

class WindowManager extends Node {
  addChild(node){
    super.addChild(node);
    //if(node.isHidden){
    //}
  }
}


if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.WindowManager = WindowManager;
FView.wrap('WindowManager', famous.customLayouts.WindowManager);
