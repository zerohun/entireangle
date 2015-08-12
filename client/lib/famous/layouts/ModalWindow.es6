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
    this.setSizeMode('absolute', 'absolute').
      setAbsoluteSize(centerPoint.x/2, centerPoint.y).
      setPosition(centerPoint.x,  -2 * centerPoint.y).
      setMountPoint(0.5, 0.5);
  }
  show(){
    const centerPoint = getCenterPoint();
    const position = new famous.components.Position(this);
    position.set(centerPoint.x, centerPoint.y, 0, { duration: 500, curve: 'inOutQuart' });
  }
  hide(){
    const centerPoint = getCenterPoint();
    const position = new famous.components.Position(this);
    position.set(centerPoint.x,  -2 * centerPoint.y, 0, { duration: 500, curve: 'inOutQuart' });
  }

}

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.ModalWindow = ModalWindow;

FView.wrap('ModalWindow', famous.customLayouts.ModalWindow, {
});
