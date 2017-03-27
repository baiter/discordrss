// date to integer
if (process.argv[2] == "date"){
  var mydate = new Date(process.argv[3]).valueOf();
  console.log(mydate);
}

