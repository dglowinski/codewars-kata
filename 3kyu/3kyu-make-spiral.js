////////////////////////////////////////////////////////////////////////////
// Make a spiral                                                          //
//     - 3 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/534e01fbbb17187c7e0000c6//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////


var spiralize = function(size) {
  // insert code here
  var s = new Array(size);
  for(var i=0; i<size; i++) {
      s[i] = new Array(size).fill(0);
  }
  var fail = 0;
  var direction = 1; //1-right, 2-down, 3-left, 4-up
  var row=0, col=0, move=0;
  s[row][col]=1;

  while(fail<2) {
     switch(direction) {
        case 1:
            if( col===size-1 || s[row][col+2]===1) { 
                if(move<2) {
                    fail=2;
                } else {
                    move=0;
                    fail++;
                    direction = 2;
                }
            } else {
                col++;
                s[row][col]=1;
                fail = 0;
                move++;
            }
            break;
        case 2:
            if(row===size-1 || (row<size-2 && s[row+2][col]===1)) { 
               if(move<2) {
                    fail=2;
                } else {
                    move=0;
                    fail++;
                    direction = 3;
                }

            } else {
                row++;
                s[row][col]=1;
                fail = 0;
                move++;
            }
            break;
        case 3:
            if(col==0 || s[row][col-2]===1 ) { 
               if(move<2) {
                    fail=2;
                } else {
                    move=0;
                    fail++;
                    direction = 4;
                }
            } else {
                col--;
                s[row][col]=1;
                fail = 0;
                move++;
            }
            break;
        case 4:
            if(row==0 || (row>1 && s[row-2][col]===1 )) { 
               if(move<2) {
                    fail=2;
                } else {
                    move=0;
                    fail++;
                    direction = 1;
                }
            } else {
                row--;
                s[row][col]=1;
                fail = 0;
                move++;
            }
            break;

    }

  }
  return s;
}