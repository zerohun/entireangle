const Node = famous.core.Node;

function resize(target){
    if($(window).width() < 550){
      target.setPosition(150,10);
    }
    else{
      target.setPosition(300,10);
    }
}

class TabMenuLayout extends Node {
  constructor(){
    super();
    const self = this;
    this.addComponent({
      onSizeChange: function(size){
        resize(self);
      }
    })
    Rx.Observable.fromEvent($(window),"resize").
      subscribe(()=>{
        resize(self);
      });
  }
  addChild(child){
    child.setSizeMode('default', 'render').
      setMountPoint(0.0, 0.0);

    super.addChild(child);
    this.reflow();
  }
  reflow(){
    const childs = this.getChildren();
    const itemWidth = 1.0 / parseFloat(childs.length + 3);
    for(let i in childs){
      childs[i].
        setProportionalSize(itemWidth, null).
        setAlign(itemWidth * childs.indexOf(childs[i]), null);
    }
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.TabMenuLayout = TabMenuLayout;
FView.wrap('TabMenuLayout', famous.customLayouts.TabMenuLayout);
