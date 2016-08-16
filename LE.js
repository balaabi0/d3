const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
 input: fs.createReadStream('Indicators.csv')
});



var iso=["AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN","CXR","CCK","IOT","GEO","HKG","IND","IDN","IRN","IRQ","ISR","JPN","JOR","KAZ","PRK","KOR",
"KWT","KGZ","LAO","LBN","MAC","MYS","MDV","MNG","MMR","NPL","OMN","PAK","PHL","QAT","SAU","SGP","LKA","SYR","TWN","TJK","THA","TUR","TKM","ARE","UZB",
"VNM","YEM","PSE"];
var l=0;
var country_in;
var value_in;
var year_in;
var indicator_in;
var result=[];
var i;
var ctry1=[];
var ctry2=[];
var result1=[];
var result2=[];

rl.on('line', function (line) {
  row=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if(l==0)
  {
    l=1;
    country_in=row.indexOf("CountryCode");
    value_in=row.indexOf("Value");
    indicator_in=row.indexOf("IndicatorCode");
    year_in=row.indexOf("Year");
  }
  else {
    if(iso.indexOf(row[country_in])!=-1)
    {
      if(row[indicator_in]=="SP.DYN.LE00.FE.IN"||row[indicator_in]=="SP.DYN.LE00.MA.IN")
      {
        if(result.length==0)
        {
          var obj={};
          obj["year"]=parseFloat(row[year_in]);
          if(row[indicator_in]=="SP.DYN.LE00.MA.IN")
          {
            obj["LEM"]=parseFloat(row[value_in]);
            obj["LEF"]=0;
          }
          else {
            obj["LEF"]=parseFloat(row[value_in]);
            obj["LEM"]=0;
          }
          result.push(obj);
          //ctry.push(row[country_in]);
        }
        else {
          for(i=0;i<result.length;i++)
          {
            if(result[i]["year"]==row[year_in])
            {
              if(row[indicator_in]=="SP.DYN.LE00.MA.IN")
              {
                result[i]["LEM"]+=parseFloat(row[value_in]);
              }
              else {
                result[i]["LEF"]+=parseFloat(row[value_in]);
              }
              break;
            }
          }
          if(i==result.length)
          {
            var obj={};
            obj["year"]=parseFloat(row[year_in]);
            if(row[indicator_in]=="SP.DYN.LE00.MA.IN")
            {
              obj["LEM"]=parseFloat(row[value_in]);
              obj["LEF"]=0;
            }
            else {
              obj["LEF"]=parseFloat(row[value_in]);
              obj["LEM"]=0;
            }
            result.push(obj);
          }
        }
        if(row[indicator_in]=="SP.DYN.LE00.FE.IN")
        {
          if(ctry1.indexOf(row[country_in])==-1)
          {
            ctry1.push(row[country_in]);
          }
        }
        else {
          if(ctry2.indexOf(row[country_in])==-1)
          {
            ctry2.push(row[country_in]);
          }
        }
      }
      else if(row[indicator_in]=="SP.DYN.LE00.IN" && row[year_in]=="2013")
      {
        var obj={};
        obj["country"]=row[country_in];
        obj["LE"]=parseFloat(row[value_in]);
        result1.push(obj);
      }
    }
  }
});



rl.on('close',function(){

  for(i=0;i<result.length;i++)
  {
    result[i].LEM/=ctry2.length;
    result[i].LEF/=ctry1.length;
  }
  var str=JSON.stringify(result);
  fs.writeFile('LE1.json',str, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });

  result1.sort(function(a,b){
    return a.LE-b.LE;
  });

  for(i=0;i<5;i++)
  {
    result2[i]=result1.pop();
  }

  var str=JSON.stringify(result2);
  fs.writeFile('LE2.json',str, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });

});
