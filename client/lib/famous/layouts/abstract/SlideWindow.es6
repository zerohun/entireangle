const Node = famous.core.Node;

class SlideWindow extends Node {
  constructor(){
    super();
    this.onSizeChangeFuncs = [];
    Rx.Observable.fromEvent($(window), "resize").
      subscribe(()=>{
        this.resize();
      });
  }
  calculateSize(){
    const centerPoint = SlideWindow.getCenterPoint();
    this.width = Math.max(300, centerPoint.x/2);
    this.height = Math.max(300, centerPoint.y);
  }
  slideTo(coords){
    //const centerPoint = getCenterPoint();
    const position = new famous.components.Position(this);
    //position.set(centerPoint.x, top, 100, { duration: 500, curve: 'inOutQuart' });
    position.set(coords[0], coords[1], coords[2], { duration: 500, curve: 'inOutQuart' });
  }
  slideDown(){
    this.slideTo(this.downPosition());
    this.slideStatus = SlideWindow.DOWN;
  }
  slideUp(){
    this.slideTo(this.upPosition());
    this.slideStatus = SlideWindow.UP;
  }
  resize(){
    if(this.slideStatus === SlideWindow.UP)
      this.slideUp();
    else if(this.slideStatus === SlideWindow.DOWN)
      this.slideDown();

    this.calculateSize()
    this.setSizeMode('absolute', 'absolute').
      setAbsoluteSize(this.width, this.height);
      //setPosition(this.width,  -2 * this.height).
    if(this.onSizeChangeFuncs.length){
      this.onSizeChangeFuncs.forEach(func =>{
        func({width: this.width, height:this.height});
      });
    }
  }
  onWindowSizeChange(func){
    this.onSizeChangeFuncs.push(func);
  }
}
SlideWindow.UP = Symbol("UP");
SlideWindow.DOWN = Symbol("DOWN`");
SlideWindow.getCenterPoint = ()=>{
  return {
      x: $(window).width() / 2,
      y: $(window).height() / 2
  };
};

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.SlideWindow = SlideWindow;

FView.wrap('SlideWindow', famous.customLayouts.SlideWindow, {
});
