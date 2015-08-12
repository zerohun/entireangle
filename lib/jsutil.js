Array.intersectionSet = function(set1, set2){
    var biggerSet, smallerSet;
    var newSet = [];
    if(set1.length > set2.length){
        biggerSet = set1;
        smallerSet = set2;
    }
    else{
        biggerSet = set2;
        smallerSet = set1;
    }

    biggerSet.sort();
    smallerSet.sort();

    var bIndex = 0;
    var sIndex = 0;

    do{
        var b = biggerSet[bIndex].toString();
        var s = smallerSet[sIndex].toString();
        
        if(b > s){
            sIndex++;
        }
        else if(b < s){
            bIndex++;
        }
        else{
            newSet.push(b);
            sIndex++;
            bIndex++;
        }

    }while(bIndex < biggerSet.length && sIndex < smallerSet.length);

    return newSet;
};


Object.filterParams = function(query, AllowedKeySet){
    var keySet = Array.intersectionSet(AllowedKeySet, Object.keys(query));
    var validQuery = {};

    for(var i in keySet){
       validQuery[keySet[i]]  = query[keySet[i]];
    }

    return validQuery;
};

Object.try = function(obj, name){

  if(arguments.length < 2){
    throw new Error("insurfficent params");
  }
  if(obj === null) return null;
  if(!obj[name]) return null;
  if(arguments.length > 2)
    return Object.prototype.apply(obj,(arguments.slice(0, arguments.length))); 
  else if(arguments.length == 2)
    return obj[name]; 

};


