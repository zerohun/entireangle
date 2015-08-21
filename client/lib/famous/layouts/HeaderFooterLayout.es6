const Node = famous.core.Node;

class HeaderFooterLayout extends Node {
  constructor(){
    super();
    let self = this;
    Rx.Observable.fromEvent($(window), 'resize').
      subscribe(() =>{
        self.reflow();
      });
    this.addComponent({
        onSizeChange: function(size){
          self.reflow();
        }
    });
  }
  addChild(child){
    if(this.header){
      this.content = child;
      child.setSizeMode('default', 'render').
        setPosition(0, HeaderFooterLayout.HEADER_SIZE(), 100);
    }
    else{
      this.header = child; 
      child.setSizeMode('default', 'absolute')
        .setAbsoluteSize(null, HeaderFooterLayout.HEADER_SIZE());
    }
    super.addChild(child);
  }
  setHeightMode(mode){
    this.heightMode = mode;
    this.reflow();
  }
  reflow(){
    const headerSize = HeaderFooterLayout.HEADER_SIZE();
    if(this.header){
        this.header.setAbsoluteSize(null, headerSize);
    }
    if(this.content){
      this.content.setPosition(0, HeaderFooterLayout.HEADER_SIZE(), 100);
      if(this.heightMode === HeaderFooterLayout.HEIGHT_MODES.FILL){
        this.content.setSizeMode('default', 'absolute').
          setAbsoluteSize(null, $(window).height() - headerSize);
      }
      else if(this.heightMode === HeaderFooterLayout.HEIGHT_MODES.SCROLL){
        this.content.setSizeMode('default', 'render');
      }
    }
  }
}

HeaderFooterLayout.HEADER_SIZE = ()=>{
  const windowWidth = $(window).width();
  if(windowWidth > 550){
    return 58;
  }
  else{
    return 44;
  }
};
HeaderFooterLayout.HEIGHT_MODES = {};
HeaderFooterLayout.HEIGHT_MODES.SCROLL = Symbol("SCROLL");
HeaderFooterLayout.HEIGHT_MODES.FILL = Symbol("FILL");

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.HeaderFooterLayout = HeaderFooterLayout;

FView.wrap('HeaderFooterLayout', famous.customLayouts.HeaderFooterLayout, {
  addedAt: function(id, child, index) {
    this.node.addChild(child);
  }
});
