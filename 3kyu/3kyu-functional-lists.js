////////////////////////////////////////////////////////////////////////////
// Functional Lists                                                       //
//     - 3 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/527bbf9f8699010bf40006ee//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////

function List() {}

function EmptyList() {}
EmptyList.prototype = new List();
EmptyList.prototype.constructor = EmptyList;

EmptyList.prototype.toString = function() { return "()"; };
EmptyList.prototype.isEmpty = function() { return true; };
EmptyList.prototype.length = function() { return 0;  };
EmptyList.prototype.push = function(x) { return new ListNode(x, this); };
EmptyList.prototype.remove = function(x) { return this; };
EmptyList.prototype.append = function(xs) { return xs instanceof ListNode?xs:new ListNode(xs, new EmptyList()) };

function ListNode(value, next) { 
    this.v = value;
    this.n = next;
    return this;    
 }
ListNode.prototype = new List();
ListNode.prototype.constructor = ListNode;
ListNode.prototype.isEmpty = function() { return false; };

ListNode.prototype.toString = function() { return "("+this.head()+(this.tail() instanceof EmptyList?"":" ")+this.tail().toString().replace(/[\(\)]/g, "")+")" };

ListNode.prototype.head = function() { return this.v; };
ListNode.prototype.tail = function() { return this.n;  };
ListNode.prototype.length = function() { return 1 + this.tail().length(); };
ListNode.prototype.push = function(x) { return new ListNode(x, this);  };
ListNode.prototype.remove = function(x) {
    if(this.head() === x) {
      return this.tail().remove(x);
    } else {    
      if(this.tail().isEmpty()) {
        return this; 
      } else {
        var newTail = this.tail().remove(x);
        return newTail === this.tail() ? this : newTail.push(this.head());
      }
  }
};
ListNode.prototype.append = function(xs) { return this.tail().append(xs).push(this.head()) };