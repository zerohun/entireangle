function getVRDeviceInfo(){

  function getVRDeviceType(){
    var deviceType;
    if(isMobile.phone){
      deviceType = 'MOBILE';
    }
    else if(navigator.getVRDevices) {
      deviceType = 'HMD';
    }
    else{
      deviceType = 'NONE';
    }
    return deviceType;
  }
  
  result = {};
  result.type = getVRDeviceType();
  result.isVrSupported = (result.type != "NONE");
  return result;
}

