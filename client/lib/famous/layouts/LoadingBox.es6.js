const Node = famous.core.Node;

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

class LoadingBox extends Node {
  constructor(){
    super();
    this.setSizeMode('absolute', 'absolute');
    this.setPosition(0,0,9999);
    this.resize();
    this.relocate();
    const self = this;
    Rx.Observable.fromEvent(window, "resize").
      subscribe(()=>{
        self.resize();
      });
      
    Rx.Observable.fromEvent(window, "scroll").
      subscribe(()=>{
        self.relocate();
      });
    this.opacityTransitionable = new famous.transitions.Transitionable(0.8);
    this.transitionableId = this.addComponent({
        onUpdate: function(time) {
            // Every frame, query transitionable state and set node opacity accordingly
            const newOpacity = self.opacityTransitionable.get();
            //console.log(newOpacity);
            self.setOpacity(newOpacity);
            if (self.opacityTransitionable.isActive()) self.requestUpdate(self.transitionableId);
            else{
              if(newOpacity === 0.0){ 
                super.hide();
                console.log('hide');
                if (window.removeEventListener)
                  window.removeEventListener('DOMMouseScroll', preventDefault, false);
                window.onmousewheel = document.onmousewheel = null; 
                window.onwheel = null; 
                window.ontouchmove = null;  
                document.onkeydown = null;  

              }
            }
        }
    });
    this.requestUpdate(this.transitionableId);
  }
  resize(){
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    this.setAbsoluteSize(windowWidth, windowHeight);
  }
  relocate(){
    this.setPosition(0, $(window).scrollTop(), 9999);
  }
  show(){
    
    if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
    
    super.show();
    this.opacityTo(0.8, $.noop());
  }
  hide(){
    this.opacityTo(0.0, () => {super.hide();});
  }
  opacityTo(val, done){
    this.opacityTransitionable.set(val, { duration: 200 }, done);
    this.requestUpdate(this.transitionableId);
  }
}

if(!famous.customLayouts){
  famous.customLayouts = {};
}

famous.customLayouts.LoadingBox = LoadingBox;
FView.wrap('LoadingBox', famous.customLayouts.LoadingBox);
