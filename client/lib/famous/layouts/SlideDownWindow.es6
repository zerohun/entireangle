const SlideWindow = famous.customLayouts.SlideWindow;

class SlideDownWindow extends SlideWindow {
  constructor(){
    super();
    this.slideStatus = SlideWindow.UP;
    this.resize();
    this.setMountPoint(0.5, 0.5);
    const upPosition = this.upPosition();
    this.setPosition(upPosition[0], upPosition[1], upPosition[2]);

  }
  upPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  -4 * centerPoint.y, 999];
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
