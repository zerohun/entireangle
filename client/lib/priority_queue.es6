class PriorityQueue{
  constructor(lastIndex){
    this.lastIndex = lastIndex;
    this.reset();
  }
  reset(){
    this.funcQueue=[];
    this.excuteCount = 0;
    this.executing = false;
  }
  add(index, func, options){
    if(index > this.lastIndex) {
      throw new Error(`last index is ${this.lastIndex}. so item index should be lower than this`);
    }
    if(index > this.funcQueue.length){
      while(index > this.funcQueue.length){
        this.funcQueue.push(null);
      }
      this.funcQueue.push(func);
    }
    else{
      if(this.funcQueue[index])
        console.warn(`Index ${index} is alreay being used`);
      else
        this.funcQueue[index] = func;
    }

    if(!this.executing) this._excute();
  }
  _excute(){
    res = this._naiveExcute();
    if(res.finish){
      if(this.funcQueue.length > this.lastIndex){
        this.reset();
      }
      this.executing = false;
      return;
    }
    else{
      if(res.wait){
        setTimeout(()=>{
          this._excute();
        }, 100);
      }
      else{
        this._excute();
      }
    }
  }
  _naiveExcute(){
    if(this.excuteCount == this.funcQueue.length) return {finish: true};
    let func = this.funcQueue[this.excuteCount];
    if(func){
      func();
      this.excuteCount++;
      return {finish: false, wait: false};
    }
    else{
      return {finish: false, wait: true};
    }
  }
}

window.pq = new PriorityQueue(1);
