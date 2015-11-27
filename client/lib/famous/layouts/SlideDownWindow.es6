const SlideWindow = famous.customLayouts.SlideWindow;

class SlideDownWindow extends SlideWindow {
  constructor(){
    super();
    this.slideStatus = SlideWindow.UP;
    this.slideUpFuncs = [];
    this.resize();
    this.setMountPoint(0.5, 0.0);
    const upPosition = this.upPosition();
    this.setPosition(upPosition[0], upPosition[1], upPosition[2]);
  }
  upPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    return [centerPoint.x,  -4 * centerPoint.y, 1000];
  }
  downPosition(){
    const centerPoint = SlideWindow.getCenterPoint(); 
    const navbarHeight = 25;
    return [centerPoint.x, navbarHeight, 1000];
  }
  slideDown(){
    $(".hide-on-modal").hide();
    super.slideDown();
    setTimeout(()=>{
      this._isVisible = true;
    }, 500);
  }
  slideUp(){
    $(".hide-on-modal").show();
    super.slideUp();
    this.slideUpFuncs.forEach((f)=>{
      f();
    });
    setTimeout(()=>{
      this._isVisible = false;
    }, 500);
  }
  onSlideUpOnce(func){
    this.slideUpFuncs.push(func);
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}
famous.customLayouts.SlideDownWindow = SlideDownWindow;

FView.wrap('SlideDownWindow', famous.customLayouts.SlideDownWindow, {
});
