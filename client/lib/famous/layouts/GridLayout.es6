const Node = famous.core.Node;
const ROW_ITEM_NUMBER = 4;
const WIDTH_HEIGHT_LATIO = 1.3;

class GridLayout extends Node {
  constructor(){
    super();
    window.t = this;
    this.setSizeMode("default", "absolute").
      setAbsoluteSize(null, 0);
    this.addComponent({
      onSizeChange: (size) => {
        if(size[0] > 0){
          this.reflow(size[0]);
        }
      }
    });
    this.orderdChildren = [];
  }
  addChild(child){
    const i = this.getChildren().length;
    super.addChild(child);
    this.orderdChildren.push(child);
    child.setSizeMode("default", "render");
    this.reflow();
  }
  reflow(nodeWidth){
  
    if(!nodeWidth) nodeWidth = this.getSize()[0];

    const childs = this.orderdChildren;
    const childsCount = childs.length;
    for(var i in childs){
      const width = nodeWidth / ROW_ITEM_NUMBER;
      const height = width * WIDTH_HEIGHT_LATIO;
      childs[i].setSizeMode("absolute", "absolute").
        setAbsoluteSize(width, height);

        var Position = famous.components.Position;
        var position = new Position(childs[i]);
        position.set(width * (i % ROW_ITEM_NUMBER),  
                    Math.floor(i / ROW_ITEM_NUMBER) * height,
                    0,
                    { duration: 100, curve: 'inOutQuart' });
    }
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.GridLayout = GridLayout;
FView.wrap('GridLayout', famous.customLayouts.GridLayout);
