# Simple node servers to route messages from multiple Leap Motion devices

Since the Leap SDK only supports hooking up one Leap to a computer currently,
to play with multiple leaps at the same time we forward events from the Leap
SDK on different machines (the arms) to one server (the head) and then it can
forward all the Leap events to an endpoint for visualization or interaction
(the eyes).

### Head
The head is the main router, it takes messages from the "arms" and forwards
them to "eyes". Events from each arm are labeled with the .arm property with a
unique index

### Arm
An arm is a node client that forwards messages from a local Leap websocket to
the head. 

### Eye
An eye simply connects to the head and sends an "eye" message to let the head
know it would like to recieve all leap events.

##Usage

run the head server first:  
```
node head.js
```  
you can modify the host and port it listens to in settings.js  

run an arm on each machine with a Leap  
```
HEADHOST=localhost HEADPORT=1337 node arm.js
```
adjust the host and port accordingly to point to your head server

connect an "eye" to the head, an example client is given below

##Example 
An example can be found in this tributary:
http://tributary.io/inlet/4703710

