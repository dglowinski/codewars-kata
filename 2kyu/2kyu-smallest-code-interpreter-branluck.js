////////////////////////////////////////////////////////////////////////////
// My smallest code interpreter (aka Brainf**k)                           //
//     - 2 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/526156943dfe7ce06200063e//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////



function brainLuck(code, input){
  var findMatching= function (bracket, startInd) {
      var cur = startInd;
      var antiBracket = bracket=="[" ? "]" : "[";
      var direction = bracket=="]" ? 1 : -1;
      var count = 1;
      
      while (count>0) {
        cur += direction;
        if(code[cur]==antiBracket) count++;
        if(code[cur]==bracket) count--;
      }

      return cur;
  }
  
  var data = [0];
  var dp = 0, 
      ip = 0;
  var output = "";
  var stop=0;

  input = input.split("");

  while(!stop) {
      switch (code[ip]) {
          case ",":
            if(input.length==0 || !(i=input.shift()) ) {
                stop=1;
            } else {
                data[dp]=i.charCodeAt(0);
                ip++
            }
            break;

         case "+":
            if(data[dp]++ && data[dp] > 255) data[dp]=0;
            ip++;
            break;
         
         case "-":
            if(data[dp]-- && data[dp] < 0) data[dp]=255;
            ip++;
            break;
         
         case "[":
            if(data[dp]==0) {
                //jump
                ip=findMatching("]", ip)+1;
               
                if(ip == code.length) stop=1;
            } else {
                ip++;
            }
            break;

         case "]":
            if(data[dp]!=0) {
                //jump
                ip=findMatching("[",ip)+1;
                
            } else {
                ip++;
            }
            break;
         case ".":
            output+=String.fromCharCode(data[dp]);
            ip++;
            break;
          case ">":
            dp++;
            if (dp== data.length) data.push(0);
            ip++;
            break;
          case "<":
            dp--;
            ip++;
            break;
          default:
            ip++
            break;
      }
      if(ip == code.length)
       stop=1;
  }    


  return output;
}