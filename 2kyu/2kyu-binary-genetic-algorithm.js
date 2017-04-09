////////////////////////////////////////////////////////////////////////////
// Binary Genetic Algorithms                                              //
//     - 2 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/526f35b9c103314662000007//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////

var GeneticAlgorithm = function () { };

GeneticAlgorithm.prototype.generate = function (length) {
  ret = '';
  for(var i=0;i<length; i++) {
    rand = Math.random();
    if(rand<=0.5)
      ret+="0";
    else
      ret+="1";
  }
    
    return ret;
  
  //return new Array(length).fill("").map(el=>Math.floor(Math.random()*1.999)).join('');
};

GeneticAlgorithm.prototype.select = function (population, fitnesses) {
  if(this.populationWheel.length==0) {
    var joint = population.map((el, ind) => { var o={}; o.c=el; o.f=fitnesses[ind]; return o; });
    var sumFitness = 0;
    joint.forEach(el=>sumFitness+=el.f); 
    joint = joint.map(el=>{el.f/=sumFitness; return el});

    var offset=0;
    this.populationWheel = joint.map(el=>{offset+=el.f; el.f=offset; return el});
  }
  wheel = Math.random();
  var first = this.populationWheel.filter(el=>el.f>=wheel)[0];
  wheel = Math.random();
  var second = this.populationWheel.filter(el=>el.f>=wheel)[0];
  
  return [first.c, second.c];
};

GeneticAlgorithm.prototype.mutate = function (chromosome, p) {
  return chromosome.split('').map(b => Math.random() <= p ? Math.abs(b - 1) : b).join('');
};

GeneticAlgorithm.prototype.crossover = function (chromosome1, chromosome2) {
 // var pos = 1 + Math.floor(Math.random() * (chromosome1.length - 1));
  var pos =  Math.floor(Math.random() * chromosome1.length );

  return [chromosome1.slice(0, pos) + chromosome2.slice(pos), chromosome2.slice(0, pos) + chromosome1.slice(pos)];
};

GeneticAlgorithm.prototype.run = function (fitness, length, p_c, p_m, iterations) {

  iterations = iterations || 100;

  var populationSize = 180;
  var population = new Array(populationSize).fill("");
 
  population = population.map(el => GeneticAlgorithm.prototype.generate(length));
 
  var populationFitness;


  for (var i = 0; i < iterations; i++) {
    newPopulation = new Array();
    this.populationWheel="";
    populationFitness = population.map(el => fitness(el));
    while(newPopulation.length<populationSize) {
      newC = this.select(population, populationFitness);
      if(Math.random() <= p_c)
        newC = this.crossover(newC[0],newC[1]);
      newC = newC.map(el=>GeneticAlgorithm.prototype.mutate(el));
      newPopulation = newPopulation.concat(newC); 
    }
    population = newPopulation;
  }

  populationFitness = population.map(el => fitness(el));

  var joint = population.map((el, ind) => { var o={}; o.c=el; o.f=populationFitness[ind]; return o; });
  return joint.sort((a,b)=>b.f-a.f)[0].c;

};