# Gauges

It's a simple way of insert gauges in your web site or any kind of this composed by html, css and js

To start you will need a div in a html file, like this 

```html
<div id="container" style="width:400px; height:400px"> </div> 
```

Once you have this nice div, that could be whatever size you want or flex or scalable
You will need to define our component with js

```javascript
var gauge1 = new Gauge('container', {}); //will define the comp container is the name of the div, and {} are the configs of the gauge                                              //if you dont pass nothing it will take the defaults;
gauge1.render(); //Will make it apear on the screen
```
When this script runs, something like this you apear

![](image/defined_gauge.png)

Now thar you have your gauge ready to use calling a funtion will make it fill like a cicle progress bar. 

```javascript
gauge1.complete(80); //will complete 80% of the gauge
gauge1.setText("80%"); //will put a text inside it
```
![](image/gauge_completing.gif)

Well if you wanna play more with the functionalities of this componet visit my codepen 
there you can test   whatever you want!


[https://codepen.io/leonardorampazzo/pen/XWWrazz]
Change the view mode for a better experience. 
![](image/codepen.gif)







