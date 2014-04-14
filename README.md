## World Distribution

#### HTML
The index.html file contains the normal includes for the CSS and Javascript files. In the following

```
<div class="block">
    <div id="canvasWorldDistribution" data-haplogroup-id="51471f79e4b0372285470f83" ></div>
</div>
```

The Canvas used for the map and data will be created by the javascript as a child of the div element with the id canvasWorldDistribution.
There is a test Haplogroup id within the attribute data-haplogroup-id you would replace this with the Haplogroup id for the result.

###### Script tags

Jquery is used minimally and will be depreciated. (yuck)

The GSAP Greensock library is currently only used for the Ticker. The library usage will increase in future versions.

The two createjs libraries are used extensively.

You can use the stats display for performance monitoring, uncomment the initial load and jquery lines in the WDViewer.loadInit function, then uncomment the start and stop lines in the frameRender function.

#### CSS

There is a very simple CSS preloader within the #Processing styling with links to two assets in the /img folder. Otherwise please note the normal canvas margin and padding fills.

#### Javascript

The javascript file worldDistribution.js has an anonymous executing function called WDViewer, this loads the assets on start-up and then when all is loaded the GSAP Ticker fires the frameRender function.

There are three other anonymous functions handling the loading the drawing and the control.

#### Support

Email me at alan@scotlandsdna.com for any questions and usage.

©The Moffat Partnership
