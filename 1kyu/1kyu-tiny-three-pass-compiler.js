////////////////////////////////////////////////////////////////////////////
// Tiny Three-Pass Compiler                                               //
//     - 1 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/5265b0885fda8eac5900093b//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////


function Compiler () {};

Compiler.prototype.compile = function (program) {
  return this.pass3(this.pass2(this.pass1(program)));
};

Compiler.prototype.tokenize = function (program) {
  // Turn a program string into an array of tokens.  Each token
  // is either '[', ']', '(', ')', '+', '-', '*', '/', a variable
  // name or a number (as a string)
  var regex = /\s*([-+*/\(\)\[\]]|[A-Za-z]+|[0-9]+)\s*/g;
  return program.replace(regex, ":$1").substring(1).split(':').map( function (tok) {
    return isNaN(tok) ? tok : tok|0;
  });
};

Compiler.prototype.pass1 = function (program) {
  var tokens = this.tokenize(program),
      t=0,
      argList = [],
      ast = {};
  var peek = () => tokens[t];
  var advance = () => tokens[t++];

  var parseFunction = function() {
      if(advance() == '[')
        parseArgList()
      if(advance() === ']' )
        return parseExpression();
      error();
  }

  var parseArgList = function() {
    if(peek()==']') return;
    argList.push(advance());
    parseArgList();
  }
  var parseExpression = function() {
    var term = parseTerm();
    while(peek()==='+' || peek()==='-') 
      term = {op:advance(), a: term, b: parseTerm()}
    if(term) return term;
    else error();
  }

  var parseTerm = function() {
    var factor=parseFactor();
    while(peek() === "*" || peek() === "/") 
        factor = {op: advance(), a: factor, b: parseFactor()};    
    if(factor) return factor;
    else error();
  }
  
  var parseFactor = function() {
    if(isNumber( peek() ))
      return {op:'imm', 'n':advance()};
    
    argn = isVariable( peek() )
    if(argn>-1) {
      advance();
      return {op:'arg', 'n':argn}
    }
    
    if( peek() === '(') {
      advance();
      var exp = parseExpression();
      if(peek() === ')') {
        advance();
        return exp;
      }
    }
    error();
  } 
  var isNumber = function(token) {
    token = token || token[0];
    return /[0-9]/.test(token); 
  }
  var isVariable = function(token) {
    return argList.indexOf(token);
  }
  var error=function() {
    throw "Parse error at char: "+t;
  }
  // return un-optimized AST
  return parseFunction();
};

Compiler.prototype.pass2 = function (ast) {

  var optimize = function(node) {
    if (node.op === 'imm' || node.op === 'arg') return node;
    var a = optimize(node.a);
    var b = optimize(node.b); 
    if(a.op === 'imm' && b.op === 'imm') {
      var result;
      switch (node.op) {
        case "+": result = a.n + b.n; break;
        case "-": result = a.n - b.n; break;
        case "*": result = a.n * b.n; break;
        case "/": result = a.n / b.n; break; 
      }
      return {op:"imm", n:result};
    } else {
      return {op:node.op, a:a, b:b}
    }
  }

  return optimize(ast);
};

Compiler.prototype.pass3 = function (ast) {
  var prog=[];

  var assembly = function(node) {
    
    if(node.op==='imm') { prog.push("IM "+node.n); return }
    if(node.op==='arg') { prog.push("AR "+node.n); return }
 
    assembly(node.a);
    prog.push("PU");
    assembly(node.b);
    prog.push("SW");
    prog.push("PO");

    switch(node.op) {
      case "+": prog.push("AD"); break;
      case "-": prog.push("SU"); break;
      case "*": prog.push("MU"); break;
      case "/": prog.push("DI"); break;
    }
  }
  assembly(ast);
  return prog;
};