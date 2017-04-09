////////////////////////////////////////////////////////////////////////////
// bit "Wise" #2: SHIFT-iness                                             //
//     - 3 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/523fba59cb9aaaef4f000135//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////


Number.prototype.twos = function(n) {
  //You may assume for this excercise that  n >= 2... 
 var numToBin = function(num, bits){
    var rest,
        ret = [];
    while (num>0) {
      rest = num%2;
      ret.unshift(rest);
      num = (num-rest)/2;
    }
    ret = ret.join('');
    return "0".repeat(bits-ret.length) + ret;

  }
 
 var maxNum = function(bits) {
   if(bits==0) return 0;
   var max=1;
   for(var i=1; i<bits; i++) 
     max += Math.pow(2,i);

   return max;
 }
 
  var val=this.valueOf();
  var str=''
  if (val >=0) {
      return numToBin(val,n);
  } else {
      return "1"+numToBin(maxNum(n-1)+1+val, n-1);
  }

};