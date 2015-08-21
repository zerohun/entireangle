const SlideWindow = famous.customLayouts.SlideWindow;

class SlideUpWindow extends SlideWindow {
  constructor(){
    super();
    const downPosition = this.downPosition();
    this.setPosition(downPosition[0], downPosition[1], downPosition[2]);
    this.slideStatus = SlideWindow.DOWN;
    this.setMountPoint(0.5, 0.0);
  }
  calculateSize(){
    const centerPoint = SlideWindow.getCenterPoint();
    this.width = Math.max(300, centerPoint.x/2);
    this.height = Math.max(300, centerPoint.y * 2 - SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE - 10);
  }
  upPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  centerPoint.y /4, 999];
  }
  downPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    console.log(2 * centerPoint.y - SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE);
    return [centerPoint.x,  2 * centerPoint.y - SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE, 999];
  }
}
SlideUpWindow.constants = {};
SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE = 60;

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.SlideUpWindow = SlideUpWindow;

FView.wrap('SlideUpWindow', famous.customLayouts.SlideUpWindow, {
});
