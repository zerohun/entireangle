const SlideWindow = famous.customLayouts.SlideWindow;

class SlideUpWindow extends SlideWindow {
  constructor(){
    super();
    const downPosition = this.downPosition();
    this.setPosition(downPosition[0], downPosition[1], downPosition[2]);
    this.slideStatus = SlideWindow.DOWN;
  }
  upPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  centerPoint.y, 999];
  }
  downPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  4 * centerPoint.y, 999];
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.SlideUpWindow = SlideUpWindow;

FView.wrap('SlideUpWindow', famous.customLayouts.SlideUpWindow, {
});
