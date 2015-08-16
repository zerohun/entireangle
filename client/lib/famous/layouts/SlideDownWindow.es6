const SlideWindow = famous.customLayouts.SlideWindow;

class SlideDownWindow extends SlideWindow {
  constructor(){
    super();
    const upPosition = this.upPosition();
    this.setPosition(upPosition[0], upPosition[1], upPosition[2]);
    this.slideStatus = SlideWindow.UP;
  }
  upPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  -2 * centerPoint.y, 999];
  }
  downPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x, centerPoint.y, 999];
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.SlideDownWindow = SlideDownWindow;

FView.wrap('SlideDownWindow', famous.customLayouts.SlideDownWindow, {
});
