////////////////////////////////////////////////////////////////////////////
// Functional Binary Trees                                                //
//     - 2 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/527c1fc78699012e43000cc8//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////

function BinaryTree() {};

function BinaryTreeNode(value, left, right) {
  this.value = value;
  this.left = left;
  this.right = right;
  Object.freeze(this);
}
BinaryTreeNode.prototype = new BinaryTree();
BinaryTreeNode.prototype.constructor = BinaryTreeNode;

BinaryTreeNode.prototype.isEmpty = function() { return false; };
BinaryTreeNode.prototype.depth = function() { return 1 + Math.max(this.left.depth(), this.right.depth()); };
BinaryTreeNode.prototype.count = function() { return 1 + this.left.count() + this.right.count() };

BinaryTreeNode.prototype.inorder = function(fn) { this.left.inorder(fn); fn(this.value); this.right.inorder(fn); };
BinaryTreeNode.prototype.preorder = function(fn) { fn(this.value); this.left.preorder(fn);  this.right.preorder(fn); };
BinaryTreeNode.prototype.postorder = function(fn) {  this.left.postorder(fn);  this.right.postorder(fn); fn(this.value);};

BinaryTreeNode.prototype.contains = function(x) { 
  if(this.value === x) return true;
  return this.value<x ? this.right.contains(x) : this.left.contains(x);
};

BinaryTreeNode.prototype.insert = function(x) { 
  if(x instanceof BinaryTreeNode) {
    if (this.left.isEmpty() || x.value <= this.left.value)
      return new BinaryTreeNode(this.value, this.left.insert(x), this.right);
    else
      return new BinaryTreeNode(this.value, this.left, this.right.insert(x));
  }

  if( x <= this.value) 
    return new BinaryTreeNode(this.value, this.left.insert(x), this.right);
  else 
    return new BinaryTreeNode(this.value, this.left, this.right.insert(x));
};

BinaryTreeNode.prototype.remove = function(x) { 
  var rem;
  if( x < this.value) {
    rem = this.left.remove(x);
    return rem === this.left ? this : new BinaryTreeNode(this.value, rem, this.right);
  }
  if( x > this.value) {
    rem = this.right.remove(x);
    return rem === this.right ? this : new BinaryTreeNode(this.value, this.left, rem);
  }
  if(this.value === x) {
    if(!this.left.isEmpty() && this.right.isEmpty())
      return new BinaryTreeNode(this.left.value, this.left.left, this.left.right);
    if(this.left.isEmpty() && !this.right.isEmpty())
      return new BinaryTreeNode(this.right.value, this.right.left, this.right.right);
    if(this.left.isEmpty() && this.right.isEmpty())
      return this.left;
    if(!this.left.isEmpty() && !this.right.isEmpty()) {
        return this.right.insert(this.left);
    }      
  }  
};

////////////////////////////////////////////////////////////////////////
function EmptyBinaryTree() { Object.freeze(this); }
EmptyBinaryTree.prototype = new BinaryTree();
EmptyBinaryTree.prototype.constructor = EmptyBinaryTree;

EmptyBinaryTree.prototype.isEmpty = function() { return true; };
EmptyBinaryTree.prototype.depth = function() { return 0; };
EmptyBinaryTree.prototype.count = function() { return 0; };

EmptyBinaryTree.prototype.inorder = function(fn) { };
EmptyBinaryTree.prototype.preorder = function(fn) { };
EmptyBinaryTree.prototype.postorder = function(fn) { };

EmptyBinaryTree.prototype.contains = function(x) { return false; };
EmptyBinaryTree.prototype.insert = function(x) { return (x instanceof BinaryTreeNode) ? x : new BinaryTreeNode(x, new EmptyBinaryTree(), new EmptyBinaryTree()) };
EmptyBinaryTree.prototype.remove = function(x) { return this; };