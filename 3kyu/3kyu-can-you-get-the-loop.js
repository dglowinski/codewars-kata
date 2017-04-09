////////////////////////////////////////////////////////////////////
// Tiny Three-Pass Compiler                                       //
//     - 3 kyu kata                                               //
//     - https:www.codewars.com/kata/52a89c2ea8ddc5547a000863     //
//                                                                //
// by Dariusz Glowinski                                           //
// GitHub: https:github.com/dglowinski                            //
// Codewars: https:www.codewars.com/users/dglowinski              //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/ //
////////////////////////////////////////////////////////////////////


function loop_size(node){
 
  var nodes = [];
  var length = 0;
  while (nodes.indexOf(node)===-1) {
    nodes.push(node);
    node = node.getNext();
    length++;  
  }
  return nodes.length - nodes.indexOf(node);
}