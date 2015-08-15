const Node = famous.core.Node;
function getCenterPoint(){
  return {
      x: $(window).width() / 2,
      y: $(window).height() / 2
  };
}

class ModalWindow extends Node {
  constructor(){
    super();
    const centerPoint = getCenterPoint();
    this.width = Math.max(300, centerPoint.x/2);
    this.height = Math.max(300, centerPoint.y);
    this.setSizeMode('absolute', 'absolute').
      setAbsoluteSize(this.width, this.height).
      setPosition(this.width,  -2 * this.height).
      setMountPoint(0.5, 0.5);

    Rx.Observable.fromEvent($(window), "resize").
      subscribe(()=>{
        this.resize();
      });
  }
  show(){
    const centerPoint = getCenterPoint();
    const position = new famous.components.Position(this);
    position.set(centerPoint.x, centerPoint.y, 100, { duration: 500, curve: 'inOutQuart' });
  }
  hide(){
    const centerPoint = getCenterPoint();
    const position = new famous.components.Position(this);
    position.set(centerPoint.x,  -2 * centerPoint.y, 999, { duration: 500, curve: 'inOutQuart' });
  }
  resize(){
    if(this.getPosition()[1] > 0){
      this.show();
    }
    else{
      this.hide();
    }
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.ModalWindow = ModalWindow;

FView.wrap('ModalWindow', famous.customLayouts.ModalWindow, {
});
