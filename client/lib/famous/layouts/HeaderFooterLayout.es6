const Node = famous.core.Node;

class HeaderFooterLayout extends Node {
  constructor(){
    super();
    let self = this;
    this.addComponent({
        onSizeChange: function(size){
          if(self.content){
            if(self.heightMode === 'fill'){
              self.content.setSizeMode('default', 'absolute').
                setAbsoluteSize(null, $(window).height() - HeaderFooterLayout.HEADER_SIZE);
            }
            else if(self.heightMode === 'scroll'){
              self.content.setSizeMode('default', 'default');
            }
          }
        }
    });
  }
  addChild(child){
    if(this.header){
      this.content = child;
      child.setSizeMode('default', 'render').
        setPosition(0, HeaderFooterLayout.HEADER_SIZE);
    }
    else{
      this.header = child; 
      child.setSizeMode('default', 'absolute')
        .setAbsoluteSize(null, HeaderFooterLayout.HEADER_SIZE);
    }
    super.addChild(child);
  }
  setHeightMode(mode){
    this.heightMode = mode;
  }
}
HeaderFooterLayout.HEADER_SIZE = 68;

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.HeaderFooterLayout = HeaderFooterLayout;

FView.wrap('HeaderFooterLayout', famous.customLayouts.HeaderFooterLayout, {
  addedAt: function(id, child, index) {
    this.node.addChild(child);
  }
});
