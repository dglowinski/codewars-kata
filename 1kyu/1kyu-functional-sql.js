////////////////////////////////////////////////////////////////////////////
// Functional SQL                                                         //
//     - 1 kyu kata                                                       //
//     - Description: https:www.codewars.com/kata/545434090294935e7d0010ab//
//                                                                        //
// by Dariusz Glowinski                                                   //
// GitHub: https:github.com/dglowinski                                    //
// Codewars: https:www.codewars.com/users/dglowinski                      //
// Linkedin: https:www.linkedin.com/in/dariusz-glowinski-541a061/         //
////////////////////////////////////////////////////////////////////////////

var query = function() {
  return {
    data: [],
    groupClause: [],
    selectClause: d=> d,
    whereClause: [],
    callCounts:[],
   
    select: function(select){  
      this.checkCallCount("SELECT"); 
 
      this.selectClause = select || this.selectClause;
      return this;
    },
    
    from: function(){
      this.checkCallCount("FROM"); 

      for(var i=0; i<arguments.length;i++) {
        this.data[i] = arguments[i];
      }
      return this;      
    },
    
    where: function(where){
      var whereNew = [];
      for(var i=0; i<arguments.length;i++) {
        whereNew[i] = arguments[i];
      }
      this.whereClause.push(whereNew);
      return this;
    },

    orderBy: function(orderClause){
      this.checkCallCount("ORDERBY"); 

      this.orderClause = orderClause;
      return this;
    },
    groupBy: function(group){

      this.checkCallCount("GROUPBY"); 

      for(var i=0; i<arguments.length;i++) {
        this.groupClause[i] = arguments[i];
      }
     
      return this;
    },
    having: function(having){
      this.havingClause = having;
      return this;
    },
    execute: function(){
      //from

      //where
      var whereData = [];
      if(this.data.length==1) {
          this.data = this.filterWhere(this.data[0]);
      } else if(this.data.length==2) {
        var joinData = [];
        var join;
        for(var i = 0; i<this.data[0].length; i++)
          for(var j=0; j<this.data[1].length; j++) {
            join = [this.data[0][i], this.data[1][j]];
            if(this.testWhere(join))
              joinData.push(join);
          }
        this.data = joinData;
      }
      //group by

      if(this.groupClause.length>0) {
         this.data = this.applyGroup(this.data, 0);
      }

      
      //having
      if(this.havingClause)
        this.data = this.data.filter(this.havingClause);
      //select
      this.data = this.data.map(this.selectClause);

      //order by
      if(this.orderClause)
        this.data = this.data.sort(this.orderClause);

      return this.data;
    },
    applyGroup: function(data, level) {
        var groupData=[];
        var groups = [];
        var g;
        for(var i=0; i<data.length; i++) {
          g = this.groupClause[level](data[i]);
          if(!groups[g]) groups[g]=[];
          groups[g].push(data[i]);
        }
        for (g in groups) {
          if(level<this.groupClause.length-1)
            groups[g] = this.applyGroup(groups[g], level+1)
            groupData.push([isNaN(Number(g))? g : Number(g), groups[g]]);
        }
        return groupData;


    },
    filterWhere: function(data) {
        if(this.whereClause.length==0)
          return data
        var whereData;
        for(var i in this.whereClause) {
          if(this.whereClause[i].length==1) {
            data = data.filter(this.whereClause[i][0])
          } else {
            whereData = new Array();
            for(var j in this.whereClause[i])
              whereData = whereData.concat(data.filter(this.whereClause[i][j]));
            data = whereData;
          }
        }
        return data;
    },  
    testWhere: function(item) {
      var test=true, testOr;
      for(var i in this.whereClause)
        if(this.whereClause[i].length==1) {
          test = test && this.whereClause[i][0](item);
        } else {
          testOr = false;
          for(var j in this.whereClause[i])
           testOr = testOr || this.whereClause[i][j](item);
          test = test && testOr;
        }
      return test;
    },
    checkCallCount: function(type) {
      if(this.callCounts[type])
        throw new Error("Duplicate "+type);
      else 
        this.callCounts[type]=1;
    }
  };
};