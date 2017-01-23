var positiveTests = 0;
runTest("127.0.0.1", 10, 21)
/**
 * Port scan the specified IP address with the given ports. For a list
 * of blacklisted ports, see 
 * https://goo.gl/y6MPYO
 * ip - The address or hostname to scan
 * port - The numeric port to scan
 * sampleCount - the number of tests to perform. The more tests, the more accurate the results
 * 							 Default: 10
 * index - used for recursion, the index of this test
 * positiveTests - used for recursion, the number of positive tests so far
 */
function runTest(ip, port, sampleCount, index, positiveTests) {
	index = index || 0;
	positiveTests = positiveTests || 0;
  sampleCount = sampleCount || 10;
  getTiming(ip, 8600 + Math.round(Math.random() * 99), function(deltaBaseline) {
    getTiming(ip, port, function(deltaOpen) {
      console.log("OPEN " + deltaOpen)
      console.log("CLOSED " + deltaBaseline)
      if(deltaBaseline - deltaOpen > 200) {
        console.log("Port is responding.")
        positiveTests++;
      }
      if(index < sampleCount) {
      	runTest(ip, port, sampleCount, index + 1, positiveTests);
      } else {
      	console.log("Testing complete.");
        console.log("Tests that returned positive: " + positiveTests)
        if(positiveTests >= index * 0.7) {
          console.log("Port is most likely open.")
        }
      }
    });
  });
}
function getTiming(ip, port, callback) {
  var t1 = new Date().getTime();
  try {
  	var socket = new WebSocket("ws://" + ip + ":" + port + "/'" + Math.random() );
  } catch(e) {
  	var deltaTime = new Date().getTime() - t1;
    if(e.message.indexOf("is not allowed.") != -1) {
    	console.error("A blacklisted or blocked port has been detected.");
      return;
    } else {
    	throw e;
    }
  }
  socket.onerror = function(e){
  	var deltaTime = new Date().getTime() - t1;
    callback(deltaTime);
    socket.close();
  };
  socket.onclose = function(){
  }
  socket.onopen = function(){
    console.log("Socket opened.")
  }
}
